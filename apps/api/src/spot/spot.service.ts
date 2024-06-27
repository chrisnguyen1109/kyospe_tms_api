import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { TRN_CRS006_001Exception } from '@app/common/filters/exceptions/TRN_CRS006_001.exception';
import { TRN_CRS007_001Exception } from '@app/common/filters/exceptions/TRN_CRS007_001.exception';
import { TRN_CRS007_002Exception } from '@app/common/filters/exceptions/TRN_CRS007_002.exception';
import { TRN_REQ006_001Exception } from '@app/common/filters/exceptions/TRN_REQ006_001.exception';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import { AbilityAction, AlphabetSpot } from '@app/common/types/common.type';
import { RoleDiv, SlipStatusDiv, StatusDiv } from '@app/common/types/div.type';
import { ClassConstructor } from '@app/common/types/util.type';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { TSpotRepository } from '@app/database/repositories/tSpot.repository';
import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { mappingSpotUnassign } from './dtos/getUnassignSpotsResponse.dto';
import { UpdateLatLngBodyDto } from './dtos/updateLatLngBody.dto';
import { UpdateWorkMemoBodyDto } from './dtos/updateWorkMemoBody.dto';
import { UpdateWorkStatusNoSignBodyDto } from './dtos/updateWorkStatusNoSignBody.dto';
import { UpdateWorkStatusSignBodyDto } from './dtos/updateWorkStatusSignBody.dto';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { MBaseEntity } from '@app/database/entities/mBase.entity';

@Injectable()
export class SpotService {
  private logger = new Logger (SpotService.name);
  constructor(
    private readonly userAbilityFactory: UserAbilityFactory,
    private readonly blobStorageService: BlobStorageService,

    private readonly tSpotRepository: TSpotRepository,
    private readonly tSlipHeaderRepository: TSlipHeaderRepository,
    private readonly mBaseRepository: MBaseRepository,
    private readonly mUserRepository: MUserRepository,
  ) {}

  async getUnassignSpots(serviceYmd: string, currentUser: LoginUserDto) {
    const queryBuilder = this.tSpotRepository
      .createQueryBuilder('tSpot')
      .leftJoinAndSelect('tSpot.trip', 'trip')
      .leftJoinAndSelect('trip.tSlipHeader', 'tSlipHeader')
      .leftJoinAndSelect('tSpot.base', 'base')
      .where('trip.serviceYmd = :serviceYmd', { serviceYmd })
      .andWhere('trip.courseSeqNo IS NULL')
      .leftJoinAndMapOne(
        'tSlipHeader.tSlipHeaderForPurchaseOrder',
        TSlipHeaderEntity,
        'tSlipHeaderForPurchaseOrder',
        'tSlipHeaderForPurchaseOrder.slipNoForPurchaseOrder = tSlipHeader.slipNo',
      )
      .leftJoinAndMapOne(
        'tSlipHeaderForPurchaseOrder.purchaseOrderTrip',
        TTripEntity,
        'purchaseOrderTrip',
        'purchaseOrderTrip.slipNo = tSlipHeaderForPurchaseOrder.slipNo AND purchaseOrderTrip.serviceYmd = trip.serviceYmd',
      )
      .leftJoinAndMapOne(
        'trip.receivingWarehouseBase',
        MBaseEntity,
        'receivingWarehouseBase',
        'receivingWarehouseBase.baseId = trip.arriveBaseId',
      )
      .leftJoinAndMapOne(
        'trip.startBase',
        MBaseEntity,
        'startBase',
        'startBase.baseId = trip.startBaseId',
      )
      .withDeleted()
      .leftJoinAndSelect('tSlipHeader.tSlipDetails', 'tSlipDetails')
      .leftJoinAndSelect(
        'tSlipDetails.tSlipDeadlines',
        'tSlipDeadlines',
        'tSlipDeadlines.deleteAt IS NULL',
      );

    switch (currentUser.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
        queryBuilder.andWhere('tSlipHeader.carrierId = :transportCompanyId', {
          transportCompanyId: currentUser.transportCompanyId,
        });
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        const parentCompanyId =
          await this.mUserRepository.getUserParentCompanyId(
            currentUser.mUserId,
          );
        queryBuilder.andWhere('tSlipHeader.carrierId = :parentCompanyId', {
          parentCompanyId,
        });
        break;

      default:
        break;
    }

    const spotUnassignRecords = await queryBuilder.getMany();

    const list = spotUnassignRecords.map((rec) => {
      const tmp = rec.trip?.tSlipHeader?.requestDate?.replaceAll(':', '').split('-');
      if(tmp?.length === 2) {
        const from = ((tmp[0] !== '' && Number.isFinite(Number(tmp[0]))) ? Number(tmp[0]) : 9999);
        const to = ((tmp[1] !== '' && Number.isFinite(Number(tmp[1]))) ? Number(tmp[1]) : 9999);
        const tgt = from < to ? from : to;
        this.logger.log(`tgt: ${tgt}`);
        return {...rec, requestTime: tgt }
      } if(tmp?.length === 1) {
        const tgt = (tmp[0] !== '' && Number.isFinite(Number(tmp[0]))) ? Number(tmp[0]) : 9999;
        this.logger.log(`tgt: ${tgt}`);
        return {...rec, requestTime: tgt }
      } else {
        return {...rec, requestTime: 9999 }
      }
    })
    this.logger.log(JSON.stringify(list));
    list.sort((a, b) => a.requestTime - b.requestTime);
    // this.logger.log(JSON.stringify(sorted));

    const alphabetSpot = this.getValueAlphabet(list);

    return list.map(spot =>
      mappingSpotUnassign(spot, alphabetSpot),
    );
  }

  private getValueAlphabet(spot: TSpotEntity[]) {
    const alphabetValue: AlphabetSpot[] = [];
    const childSpots: TSpotEntity[] = [];
    const parentSpots: TSpotEntity[] = [];
    let alphabet = 'A';

    spot.forEach(item => {
      if (item.trip.tSlipHeader?.slipNoForPurchaseOrder) {
        parentSpots.push(item);
      } else {
        childSpots.push(item);
      }
    });

    parentSpots.forEach(item => {
      const child = childSpots.find(
        i =>
          i.trip.tSlipHeader?.slipNo ===
          item.trip.tSlipHeader?.slipNoForPurchaseOrder,
      );

      if (child) {
        alphabetValue.push(
          { spotId: item.spotId, alphabet },
          { spotId: child.spotId, alphabet },
        );
        alphabet = String.fromCharCode(alphabet.charCodeAt(0) + 1);
      }
    });

    return alphabetValue;
  }

  async updateWorkMemo(
    currentUser: LoginUserDto,
    spotId: number,
    body: UpdateWorkMemoBodyDto,
  ) {
    const existSpot = await this.tSpotRepository.findOneOrThrow(
      {
        relations: this.getSpotRelations(currentUser.roleDiv),
        where: { spotId },
      },
      TRN_REQ006_001Exception,
      `spot not found with spotId: ${spotId}`,
    );

    const manageSpotAbility =
      this.userAbilityFactory.defineManageSpot(currentUser);

    if (manageSpotAbility.cannot(AbilityAction.UPDATE, existSpot)) {
      throw new TRN_REQ006_001Exception(
        "don't have permission to update this spot",
      );
    }

    existSpot.workMemo = body.workMemo;

    return this.tSpotRepository.save(existSpot);
  }

  async updateWorkStatusNoSign(
    currentUser: LoginUserDto,
    spotId: number,
    body: UpdateWorkStatusNoSignBodyDto,
  ) {
    return this.updateWorkStatus(
      currentUser,
      spotId,
      body.statusDiv,
      () => ({
        returnMemo: body.returnMemo,
      }),
      TRN_CRS007_001Exception,
    );
  }

  async updateWorkStatusSign(
    currentUser: LoginUserDto,
    spotId: number,
    electronicSignatureImage: Express.Multer.File,
    body: UpdateWorkStatusSignBodyDto,
  ) {
    return this.updateWorkStatus(
      currentUser,
      spotId,
      body.statusDiv,
      async slipHeader => {
        if (slipHeader.electronicSignatureImage) {
          const blobName = this.blobStorageService.getBlobNameFromUrl(
            slipHeader.electronicSignatureImage,
          );
          await this.blobStorageService.deleteBlobIfExists(blobName);
        }

        const extension = path.extname(electronicSignatureImage.originalname);
        const blobName = `electronic-signature-images/${Date.now()}_${randomUUID()}${extension}`;

        const uploadResponse = await this.blobStorageService.uploadBlobData(
          blobName,
          electronicSignatureImage.buffer,
          { blobContentType: electronicSignatureImage.mimetype },
        );

        return {
          electronicSignatureImage: uploadResponse._response.request.url,
        };
      },
      TRN_CRS007_002Exception,
    );
  }

  private async updateWorkStatus(
    currentUser: LoginUserDto,
    spotId: number,
    statusDiv: StatusDiv,
    getAssignSlipHeader: (
      slipHeader: TSlipHeaderEntity,
    ) => Promise<Partial<TSlipHeaderEntity>> | Partial<TSlipHeaderEntity>,
    ErrorException: ClassConstructor,
  ) {
    const existSpot = await this.tSpotRepository.findOneOrThrow(
      {
        relations: {
          trip: {
            tSlipHeader: true,
            ...this.getSpotRelations(currentUser.roleDiv)?.trip,
          },
        },
        where: { spotId },
      },
      ErrorException,
      `spot not found with spotId: ${spotId}`,
    );

    const manageSpotAbility =
      this.userAbilityFactory.defineManageSpot(currentUser);

    if (manageSpotAbility.cannot(AbilityAction.UPDATE, existSpot)) {
      throw new ErrorException("don't have permission to update this spot");
    }

    const slipHeader = existSpot.trip.tSlipHeader;

    existSpot.statusDiv = statusDiv;
    existSpot.workEndTime = moment().format('HH:mm:ss');

    const assignSlipHeader = await getAssignSlipHeader(slipHeader);
    Object.assign(slipHeader, {
      ...assignSlipHeader,
      slipStatusDiv: this.mapSpotToSlipStatus(statusDiv),
    });

    return Promise.all([
      this.tSpotRepository.save(existSpot),
      this.tSlipHeaderRepository.save(slipHeader),
    ]);
  }

  async updateLatLng(
    currentUser: LoginUserDto,
    spotId: number,
    body: UpdateLatLngBodyDto,
  ) {
    const existSpot = await this.tSpotRepository.findOneOrThrow(
      {
        relations: {
          base: true,
          ...this.getSpotRelations(currentUser.roleDiv),
        },
        where: { spotId },
      },
      TRN_CRS006_001Exception,
      `spot not found with spotId: ${spotId}`,
    );

    const base = existSpot.base;
    if (!base) {
      throw new TRN_CRS006_001Exception(
        `base corresponds to spot with spotId: ${spotId} not found`,
      );
    }

    const manageSpotAbility =
      this.userAbilityFactory.defineManageSpot(currentUser);

    if (manageSpotAbility.cannot(AbilityAction.UPDATE, existSpot)) {
      throw new TRN_REQ006_001Exception(
        "don't have permission to update this spot",
      );
    }

    const lat = body.latitude;
    const lng = body.longitude;

    existSpot.latitude = lat;
    existSpot.longitude = lng;

    base.latitude = lat;
    base.longitude = lng;

    return Promise.all([
      this.tSpotRepository.save(existSpot),
      this.mBaseRepository.save(base),
    ]);
  }

  private getSpotRelations(roleDiv: RoleDiv) {
    if (roleDiv === RoleDiv.SYSTEM_ADMIN) return;

    if (roleDiv === RoleDiv.TRANSPORT_COMPANY) {
      return { trip: { tCourse: true } };
    }

    return { trip: { tCourse: { driver: true } } };
  }

  private mapSpotToSlipStatus(statusDiv: StatusDiv) {
    if (statusDiv === StatusDiv.UNFINISHED) {
      return SlipStatusDiv.UNFINISHED;
    }

    if (statusDiv === StatusDiv.FINISHED) {
      return SlipStatusDiv.FINISHED;
    }

    return SlipStatusDiv.TAKE_AWAY;
  }
}

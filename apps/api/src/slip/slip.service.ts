import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { TRN_CRS011_003Exception } from '@app/common/filters/exceptions/TRN_CRS011_003.exception';
import { TRN_CRS011_004Exception } from '@app/common/filters/exceptions/TRN_CRS011_004.exception';
import { TRN_REQ007_001Exception } from '@app/common/filters/exceptions/TRN_REQ007_001.exception';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import {
  AbilityAction,
  ParameterSearchMappings,
} from '@app/common/types/common.type';
import { DivCd, RoleDiv } from '@app/common/types/div.type';
import { getPagination } from '@app/common/utils/getPagination.util';
import {
  searchQueryParams,
  sortQueryParams,
} from '@app/common/utils/handleGetListRecords';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MCourseEntity } from '@app/database/entities/mCourse.entity';
import { MDivValueEntity } from '@app/database/entities/mDivValue.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { DeleteDeliveryImageParamDto } from './dtos/deleteDeliveryImageParam.dto';
import { GetListSlipsQueryDto } from './dtos/getListSlipsQuery.dto';
import { mappingSlipDetail } from './dtos/getSlipResponse.dto';
import { UpdateAssignMemoBodyDto } from './dtos/updateAssignMemoBody.dto';
import { TRN_REQ002_001Exception } from '@app/common/filters/exceptions/TRN_REQ002_001.exception';
import { Brackets } from 'typeorm';

@Injectable()
export class SlipService {
  constructor(
    private readonly blobStorageService: BlobStorageService,
    private readonly userAbilityFactory: UserAbilityFactory,

    private readonly tSlipHeaderRepository: TSlipHeaderRepository,
    private readonly mUserRepository: MUserRepository,
  ) {}

  async getListSlips(listSlipsQuery: GetListSlipsQueryDto) {
    const {
      page,
      limit,
      sort,
      slipNo,
      receivingDateStart,
      receivingDateEnd,
      deliveryDiv,
      slipStatusDiv,
      shippingSourceWarehouseCd,
      deliveryDestinationNm,
      customerNm,
      electricSign,
    } = listSlipsQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.tSlipHeaderRepository
      .createQueryBuilder('tSlipHeader')
      .leftJoinAndMapOne(
        'tSlipHeader.deliveryDestinationNm',
        MBaseEntity,
        'mBaseDeliveryDestination',
        `mBaseDeliveryDestination.baseCd = tSlipHeader.deliveryDestinationCd AND mBaseDeliveryDestination.baseEda = tSlipHeader.deliveryDestinationBranchNum`,
      )
      .leftJoinAndMapOne(
        'tSlipHeader.customerNm',
        MBaseEntity,
        'mBaseCustomer',
        `mBaseCustomer.baseCd = tSlipHeader.customerCd AND mBaseCustomer.baseEda = tSlipHeader.customerBranchNumber`,
      )
      .select([
        'tSlipHeader.slipNo as slipNo',
        'tSlipHeader.seqNo as seqNo',
        'tSlipHeader.receivingDate as receivingDate',
        'tSlipHeader.slipStatusDiv as slipStatusDiv',
        'tSlipHeader.deliveryDiv as deliveryDiv',
        'tSlipHeader.salesOffice as salesOffice',
        'tSlipHeader.salesRepresentativeNm as salesRepresentativeNm',
        'tSlipHeader.inputStaffNm as inputStaffNm',
        'tSlipHeader.transferStaffNm as transferStaffNm',
        'tSlipHeader.procurementOfficerNm as procurementOfficerNm',
        'tSlipHeader.pickupInformation as pickupInformation',
        'tSlipHeader.carrierNm as deliveryCompany',
        'tSlipHeader.remarks as remarks',
        'mBaseDeliveryDestination.baseNm1 as deliveryDestinationNm',
        'mBaseCustomer.baseNm1 as customerNm'
      ])
      .addSelect(
        `CASE WHEN tSlipHeader.deliveryDiv = '01' OR tSlipHeader.deliveryDiv = '02' THEN tSlipHeader.receivingDate ELSE NULL END`,
        'receivingDate',
      )
      .addSelect(
        `CASE WHEN tSlipHeader.deliveryDiv = '03' THEN tSlipHeader.receivingDate ELSE NULL END`,
        'transferReceivingDate',
      )
      .addSelect(
        `CASE WHEN tSlipHeader.deliveryDiv = '01' OR tSlipHeader.deliveryDiv = '02' THEN tSlipHeader.shippingDate ELSE NULL END`,
        'shippingDate',
      )
      .addSelect(
        `CASE WHEN tSlipHeader.deliveryDiv = '03' THEN tSlipHeader.shippingDate ELSE NULL END`,
        'transferShippingDate',
      )
      .addSelect(subQuery => {
        const deliveryDivNm = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCdDeliveryStatus', {
            divCdDeliveryStatus: DivCd.DELIVERY_DIV,
          })
          .andWhere('mDivValue.divValue = tSlipHeader.deliveryDiv')
          .limit(1);
        return deliveryDivNm;
      }, 'deliveryDivNm')
      .addSelect(subQuery => {
        const slipStatusDivNm = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCdSlipStatus', {
            divCdSlipStatus: DivCd.SLIP_STATUS_DIV,
          })
          .andWhere('mDivValue.divValue = tSlipHeader.slipStatusDiv')
          .limit(1);
        return slipStatusDivNm;
      }, 'slipStatusDivNm')
      .addSelect(subQuery => {
        const shippingWarehouseNm = subQuery
          .select('mBase.baseNm1')
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.shippingWarehouseCd')
          .limit(1);
        return shippingWarehouseNm;
      }, 'shippingWarehouseNm')
      // .addSelect(subQuery => {
      //   const customerNm = subQuery
      //     .select('mBase.baseNm1')
      //     .from(MBaseEntity, 'mBase')
      //     .where(
      //       'mBase.baseCd = tSlipHeader.customerCd AND mBase.baseEda = tSlipHeader.customerBranchNumber',
      //     )
      //     .limit(1);
      //   return customerNm;
      // }, 'customerNm')
      .addSelect(subQuery => {
        const siteNm = subQuery
          .select('mBase.baseNm1')
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.siteCd')
          .limit(1);
        return siteNm;
      }, 'siteNm')
      .addSelect(subQuery => {
        const sourceWarehouseNm = subQuery
          .select('mBase.baseNm1')
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.sourceWarehouseCd')
          .limit(1);
        return sourceWarehouseNm;
      }, 'sourceWarehouseNm')
      .addSelect(subQuery => {
        const sourceWarehouseAddress = subQuery
          .select(
            `CONCAT_WS('', mBase.address1, mBase.address2, mBase.address3)`,
          )
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.sourceWarehouseCd')
          .limit(1);
        return sourceWarehouseAddress;
      }, 'sourceWarehouseAddress')
      .addSelect(subQuery => {
        const destinationWarehouseNm = subQuery
          .select('mBase.baseNm1')
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.destinationWarehouseCd')
          .limit(1);
        return destinationWarehouseNm;
      }, 'destinationWarehouseNm')
      .addSelect(subQuery => {
        const destinationWarehouseAddress = subQuery
          .select(
            `CONCAT_WS('', mBase.address1, mBase.address2, mBase.address3)`,
          )
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.destinationWarehouseCd')
          .limit(1);
        return destinationWarehouseAddress;
      }, 'destinationWarehouseAddress')
      .addSelect(subQuery => {
        const factoryWarehouseNm = subQuery
          .select('mBase.baseNm1')
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.factoryWarehouseCd')
          .limit(1);
        return factoryWarehouseNm;
      }, 'factoryWarehouseNm')
      .addSelect(subQuery => {
        const supplierNm = subQuery
          .select('mBase.baseNm1')
          .from(MBaseEntity, 'mBase')
          .where('mBase.baseCd = tSlipHeader.supplierCd')
          .limit(1);
        return supplierNm;
      }, 'supplierNm')
      .addSelect(subQuery => {
        const serviceYmd = subQuery
          .select(
            'CASE WHEN tTrip.serviceYmd = "1000/01/01" THEN null ELSE tTrip.serviceYmd END',
          )
          .from(TTripEntity, 'tTrip')
          .where(
            'tTrip.slipNo = tSlipHeader.slipNo and tTrip.serviceYmd <> "1000/01/01"',
          )
          .orderBy('tTrip.serviceYmd', 'ASC')
          .limit(1);
        return serviceYmd;
      }, 'serviceYmd')
      .addSelect(subQuery => {
        const courseSeqNo = subQuery
          .select('tTrip.courseSeqNo')
          .from(TTripEntity, 'tTrip')
          .where('tTrip.slipNo = tSlipHeader.slipNo')
          .limit(1)
          .getQuery();

        const courseId = subQuery
          .select('tCourse.courseId')
          .from(TCourseEntity, 'tCourse')
          .where(`tCourse.courseSeqNo = ${courseSeqNo}`)
          .limit(1)
          .getQuery();

        const courseNo = subQuery
          .select('course.courseNm')
          .from(MCourseEntity, 'course')
          .where(`course.courseId = ${courseId}`)
          .limit(1);
        return courseNo;
      }, 'courseNo')
      .addSelect(subQuery => {
        return subQuery
          .select('COUNT(tTrip.tripId)')
          .from(TTripEntity, 'tTrip')
          .where('tTrip.slipNo = tSlipHeader.slipNo');
      }, 'tripCount')
      .addSelect(subQuery => {
        const installmentFlag = subQuery
          .select(
            'CASE WHEN COUNT(DISTINCT tTrips.serviceYmd) > 1 THEN 1 ELSE 0 END',
            'installmentFlag',
          )
          .from(TTripEntity, 'tTrips')
          .where('tTrips.slipNo = tSlipHeader.slipNo');
        return installmentFlag;
      }, 'installmentFlag')
      .addSelect(
        `CASE WHEN tSlipHeader.electronicSignatureImage <> '' THEN 1 ELSE 0 END`,
        'electronicSignatureImageFlg',
      );

    const parameterMappings: ParameterSearchMappings[] = [
      {
        queryParam: 'slipNo',
        field: 'tSlipHeader.slipNo',
        operator: 'like',
        pattern: slipNo,
      },
      {
        queryParam: 'deliveryDestinationNm',
        field: 'mBaseDeliveryDestination.baseNm1',
        operator: 'like',
        pattern: deliveryDestinationNm,
      },
      {
        queryParam: 'deliveryDiv',
        field: 'tSlipHeader.deliveryDiv',
        operator: '=',
        value: deliveryDiv,
      },
      {
        queryParam: 'slipStatusDiv',
        field: 'tSlipHeader.slipStatusDiv',
        operator: 'IN',
        value: slipStatusDiv,
      },
      {
        queryParam: 'customerNm',
        field: 'mBaseCustomer.baseNm1',
        operator: 'like',
        pattern: customerNm,
      },
    ];

    const searchQueryBuilder = searchQueryParams(
      queryBuilder,
      parameterMappings,
    );

    if (shippingSourceWarehouseCd) {
      searchQueryBuilder.andWhere(
        new Brackets(qb => {
          qb.where(
            'tSlipHeader.shippingWarehouseCd = :shippingSourceWarehouseCd',
            { shippingSourceWarehouseCd },
          ).orWhere(
            'tSlipHeader.sourceWarehouseCd = :shippingSourceWarehouseCd',
            {
              shippingSourceWarehouseCd,
            },
          );
        }),
      );
    }
    if (receivingDateStart) {
      searchQueryBuilder.andWhere(
        'tSlipHeader.slipNo in ' +
          searchQueryBuilder
            .subQuery()
            .select('tTrip.slipNo')
            .from(TTripEntity, 'tTrip')
            .where('tTrip.serviceYmd >= :receivingDateStart')
            .getQuery(),
        {
          receivingDateStart: receivingDateStart,
        },
      );
    }
    if (receivingDateEnd) {
      searchQueryBuilder.andWhere(
        'tSlipHeader.slipNo in ' +
          searchQueryBuilder
            .subQuery()
            .select('tTrip.slipNo')
            .from(TTripEntity, 'tTrip')
            .where('tTrip.serviceYmd <= :receivingDateEnd')
            .getQuery(),
        {
          receivingDateEnd: receivingDateEnd,
        },
      );
    }
    if (electricSign === '1') {
      searchQueryBuilder.andWhere(
        'tSlipHeader.electronicSignatureImage is not null'
      )
    }
    if (electricSign === '0') {
      searchQueryBuilder.andWhere(
        'tSlipHeader.electronicSignatureImage is null'
      )
    }

    const sortQueryBuilder = sortQueryParams(searchQueryBuilder, sort);

    const totalCount = await sortQueryBuilder.getCount();
    sortQueryBuilder.limit(limit).offset(skip);

    const results = await sortQueryBuilder.getRawMany();

    return {
      results,
      pagination: getPagination(results.length, totalCount, page, limit),
    };
  }

  async getSlipDetail(slipNo: string, currentUser: LoginUserDto) {
    const slip = await this.tSlipHeaderRepository.findOneByOrThrow(
      {
        slipNo,
      },
      TRN_REQ002_001Exception,
      `slip not found with slipNo: ${slipNo}`,
    );

    switch (currentUser.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
        if (slip.carrierId !== currentUser.transportCompanyId) {
          throw new TRN_REQ002_001Exception(
            "don't have permission to view this slip",
          );
        }
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        const parentCompanyId =
          await this.mUserRepository.getUserParentCompanyId(
            currentUser.mUserId,
          );
        if (slip.carrierId !== parentCompanyId) {
          throw new TRN_REQ002_001Exception(
            "don't have permission to view this slip",
          );
        }
        break;

      default:
        break;
    }

    const slipRecord = await this.tSlipHeaderRepository
      .createQueryBuilder('tSlipHeader')
      .withDeleted()
      .where('tSlipHeader.slipNo = :slipNo', { slipNo })
      .leftJoinAndSelect('tSlipHeader.tSlipDetails', 'tSlipDetails')
      .leftJoinAndSelect('tSlipDetails.tSlipDeadlines', 'tSlipDeadlines')
      .leftJoinAndSelect('tSlipHeader.tTrips', 'tTrips')
      .leftJoinAndSelect('tTrips.tSpots', 'tSpots')
      .leftJoinAndSelect('tTrips.tCourse', 'tCourse')
      .leftJoinAndSelect('tCourse.course', 'course')
      .leftJoinAndMapOne(
        'tSlipHeader.tSlipHeaderForPurchaseOrder',
        TSlipHeaderEntity,
        'tSlipHeaderForPurchaseOrder',
        'tSlipHeaderForPurchaseOrder.slipNoForPurchaseOrder = tSlipHeader.slipNo',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.slipStatus',
        MDivValueEntity,
        'slipStatus',
        'slipStatus.divValue = tSlipHeader.slipStatusDiv AND slipStatus.divCd = :divCdSlipStatus',
        {
          divCdSlipStatus: DivCd.SLIP_STATUS_DIV,
        },
      )
      .leftJoinAndMapOne(
        'tSlipHeader.deliveryStatus',
        MDivValueEntity,
        'deliveryStatus',
        'deliveryStatus.divValue = tSlipHeader.deliveryDiv AND deliveryStatus.divCd = :divCdDeliveryStatus',
        {
          divCdDeliveryStatus: DivCd.DELIVERY_DIV,
        },
      )
      .leftJoinAndMapOne(
        'tTrips.startBase',
        MBaseEntity,
        'mBaseStart',
        `mBaseStart.baseId = tTrips.startBaseId`,
      )
      .leftJoinAndMapOne(
        'tTrips.arriveBase',
        MBaseEntity,
        'mBaseArrive',
        `mBaseArrive.baseId = tTrips.arriveBaseId`,
      )
      .leftJoinAndMapOne(
        'tSlipHeader.deliveryDestinationBase',
        MBaseEntity,
        'mBaseDeliveryDestination',
        `mBaseDeliveryDestination.baseCd = tSlipHeader.deliveryDestinationCd AND mBaseDeliveryDestination.baseEda = tSlipHeader.deliveryDestinationBranchNum`,
      )
      .leftJoinAndMapOne(
        'tSlipHeader.shippingWarehouseBase',
        MBaseEntity,
        'mBaseShippingWarehouse',
        `mBaseShippingWarehouse.baseCd = tSlipHeader.shippingWarehouseCd`,
      )
      .leftJoinAndMapOne(
        'tSlipHeader.customerBase',
        MBaseEntity,
        'mBaseCustomer',
        'mBaseCustomer.baseCd = tSlipHeader.customerCd AND mBaseCustomer.baseEda = tSlipHeader.customerBranchNumber',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.sourceWarehouseBase',
        MBaseEntity,
        'mBaseSourceWarehouse',
        'mBaseSourceWarehouse.baseCd = tSlipHeader.sourceWarehouseCd',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.destinationWarehouseBase',
        MBaseEntity,
        'mBaseDestinationWarehouse',
        'mBaseDestinationWarehouse.baseCd = tSlipHeader.destinationWarehouseCd',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.factoryWarehouseBase',
        MBaseEntity,
        'mBaseFactoryWarehouse',
        'mBaseFactoryWarehouse.baseCd = tSlipHeader.factoryWarehouseCd',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.supplierBase',
        MBaseEntity,
        'mBaseSupplier',
        'mBaseSupplier.baseCd = tSlipHeader.supplierCd',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.siteBase',
        MBaseEntity,
        'mBaseSite',
        'mBaseSite.baseCd = tSlipHeader.siteCd',
      )
      .leftJoinAndMapOne(
        'tSlipHeader.receivingWarehouseBase',
        MBaseEntity,
        'mBaseReceivingWarehouse',
        'mBaseReceivingWarehouse.baseCd = tSlipHeader.receivingWarehouseCd',
      )
      .getOne();

    if (slipRecord) {
      slipRecord.electronicSignatureImage = this.getPublicImageUrl(
        slipRecord.electronicSignatureImage,
      );
      slipRecord.image1 = this.getPublicImageUrl(slipRecord.image1);
      slipRecord.image2 = this.getPublicImageUrl(slipRecord.image2);
      slipRecord.image3 = this.getPublicImageUrl(slipRecord.image3);
      slipRecord.image4 = this.getPublicImageUrl(slipRecord.image4);
      slipRecord.image5 = this.getPublicImageUrl(slipRecord.image5);
    }

    return mappingSlipDetail(slipRecord);
  }

  async createDeliveryImage(
    currentUser: LoginUserDto,
    slipNo: string,
    deliveryImage: Express.Multer.File,
  ) {
    const slipHeader = await this.tSlipHeaderRepository.findOneByOrThrow(
      {
        slipNo,
      },
      TRN_CRS011_003Exception,
      `slip header not found with slipNo: ${slipNo}`,
    );

    if (slipHeader.isFullImage()) {
      throw new TRN_CRS011_003Exception(`full of delivery images`);
    }

    await this.checkUpdateSlipOrFail(currentUser, slipHeader).catch(() => {
      throw new TRN_CRS011_003Exception(
        `don't have permission to delete delivery image of slip header with slipNo: ${slipNo}`,
      );
    });

    const extension = path.extname(deliveryImage.originalname);
    const blobName = `delivery-images/${Date.now()}_${randomUUID()}${extension}`;

    const uploadResponse = await this.blobStorageService.uploadBlobData(
      blobName,
      deliveryImage.buffer,
      { blobContentType: deliveryImage.mimetype },
    );

    const imageProp = `image${slipHeader.getEmptyImageIndex()}` as const;

    slipHeader[imageProp] = uploadResponse._response.request.url;

    await this.tSlipHeaderRepository.save(slipHeader);

    return {
      [imageProp]: slipHeader[imageProp],
    };
  }

  async deleteDeliveryImage(
    currentUser: LoginUserDto,
    param: DeleteDeliveryImageParamDto,
  ) {
    const { imageNo, slipNo } = param;

    const slipHeader = await this.tSlipHeaderRepository.findOneByOrThrow(
      {
        slipNo,
      },
      TRN_CRS011_004Exception,
      `slip header not found with slipNo: ${slipNo}`,
    );

    await this.checkUpdateSlipOrFail(currentUser, slipHeader).catch(() => {
      throw new TRN_CRS011_004Exception(
        `don't have permission to delete delivery image of slip header with slipNo: ${slipNo}`,
      );
    });

    const imageProp = `image${imageNo}` as const;
    if (!slipHeader[imageProp]) {
      throw new TRN_CRS011_004Exception(
        `delivery image not found with imageNo: ${imageNo}`,
      );
    }

    const blobName = this.blobStorageService.getBlobNameFromUrl(
      <string>slipHeader[imageProp],
    );
    await this.blobStorageService.deleteBlobIfExists(blobName);

    Object.assign(slipHeader, { [imageProp]: null });

    return this.tSlipHeaderRepository.save(slipHeader);
  }

  async updateAssignMemo(
    slipNo: string,
    currentUser: LoginUserDto,
    body: UpdateAssignMemoBodyDto,
  ) {
    const slipHeader = await this.tSlipHeaderRepository.findOneByOrThrow(
      {
        slipNo,
      },
      TRN_REQ007_001Exception,
      `slip header not found with slipNo: ${slipNo}`,
    );

    await this.checkUpdateSlipOrFail(currentUser, slipHeader).catch(() => {
      throw new TRN_REQ007_001Exception(
        `don't have permission to update assign memo of slip header with slipNo: ${slipNo}`,
      );
    });

    slipHeader.assignMemo = body.assignMemo;

    return this.tSlipHeaderRepository.save(slipHeader);
  }

  private async checkUpdateSlipOrFail(
    currentUser: LoginUserDto,
    slipHeader: TSlipHeaderEntity,
  ) {
    const parentCompanyId =
      currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY
        ? await this.mUserRepository.getUserParentCompanyId(currentUser.mUserId)
        : undefined;

    const manageSlipAbility = this.userAbilityFactory.defineManageSlip({
      ...currentUser,
      parentCompanyId,
    });

    if (manageSlipAbility.cannot(AbilityAction.UPDATE, slipHeader)) {
      throw new Error();
    }
  }

  private getPublicImageUrl(image?: string) {
    return image ? this.blobStorageService.generatePublicUrl(image) : image;
  }
}

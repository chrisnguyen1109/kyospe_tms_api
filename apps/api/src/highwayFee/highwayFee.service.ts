import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { TRN_CRS009_001Exception } from '@app/common/filters/exceptions/TRN_CRS009_001.exception';
import { TRN_CRS009_002Exception } from '@app/common/filters/exceptions/TRN_CRS009_002.exception';
import { TRN_CRS009_003Exception } from '@app/common/filters/exceptions/TRN_CRS009_003.exception';
import { TRN_CRS011_001Exception } from '@app/common/filters/exceptions/TRN_CRS011_001.exception';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import { AbilityAction } from '@app/common/types/common.type';
import { RoleDiv } from '@app/common/types/div.type';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { THighwayFeeRepository } from '@app/database/repositories/tHighwayFee.repository';
import { THighwayFeeReceiptImageRepository } from '@app/database/repositories/tHighwayFeeReceiptImage.repository';
import { Injectable } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm';
import { CreateHighwayFeeBodyDto } from './dtos/createHighwayFeeBody.dto';
import { UpdateHighwayFeeBodyDto } from './dtos/updateHighwayFeeBody.dto';
import { randomUUID } from 'node:crypto';
import { TRN_CRS011_002Exception } from '@app/common/filters/exceptions/TRN_CRS011_002.exception';
import path from 'node:path';

@Injectable()
export class HighwayFeeService {
  constructor(
    private readonly userAbilityFactory: UserAbilityFactory,
    private readonly blobStorageService: BlobStorageService,

    private readonly tHighwayFeeRepository: THighwayFeeRepository,
    private readonly tCourseRepository: TCourseRepository,
    private readonly tHighwayFeeReceiptImageRepository: THighwayFeeReceiptImageRepository,
  ) {}

  async createHighwayFee(
    currentUser: LoginUserDto,
    body: CreateHighwayFeeBodyDto,
  ) {
    const tCourse = await this.tCourseRepository.findOneOrThrow(
      {
        relations: {
          driver: currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY,
        },
        where: {
          courseSeqNo: body.courseSeqNo,
        },
      },
      TRN_CRS009_001Exception,
      `course not found with courseSeqNo: ${body.courseSeqNo}`,
    );

    const highwayFee = this.tHighwayFeeRepository.create({ tCourse });

    const manageHighwayFeeAbility =
      this.userAbilityFactory.defineManageHighwayFee(currentUser);

    if (manageHighwayFeeAbility.cannot(AbilityAction.CREATE, highwayFee)) {
      throw new TRN_CRS009_001Exception(
        "don't have permission to create this highway fee",
      );
    }

    return this.tHighwayFeeRepository.save(highwayFee);
  }

  async updateHighwayFee(
    currentUser: LoginUserDto,
    highwayFeeNo: number,
    body: UpdateHighwayFeeBodyDto,
  ) {
    const highwayFee = await this.tHighwayFeeRepository.findOneOrThrow(
      {
        relations: this.getHighwayFeeRelations(currentUser.roleDiv),
        where: {
          highwayFeeNo,
        },
      },
      TRN_CRS009_002Exception,
      `highway fee not found with highwayFeeNo: ${highwayFeeNo}`,
    );

    Object.assign(highwayFee, body);

    const manageHighwayFeeAbility =
      this.userAbilityFactory.defineManageHighwayFee(currentUser);

    if (manageHighwayFeeAbility.cannot(AbilityAction.UPDATE, highwayFee)) {
      throw new TRN_CRS009_002Exception(
        "don't have permission to update this highway fee",
      );
    }

    return this.tHighwayFeeRepository.save(highwayFee);
  }

  async deleteHighwayFee(currentUser: LoginUserDto, highwayFeeNo: number) {
    const highwayFee = await this.tHighwayFeeRepository.findOneOrThrow(
      {
        relations: this.getHighwayFeeRelations(currentUser.roleDiv),
        where: {
          highwayFeeNo,
        },
      },
      TRN_CRS009_003Exception,
      `highway fee not found with highwayFeeNo: ${highwayFeeNo}`,
    );

    const manageHighwayFeeAbility =
      this.userAbilityFactory.defineManageHighwayFee(currentUser);

    if (manageHighwayFeeAbility.cannot(AbilityAction.DELETE, highwayFee)) {
      throw new TRN_CRS009_003Exception(
        "don't have permission to delete this highway fee",
      );
    }

    return this.tHighwayFeeRepository.remove(highwayFee);
  }

  async createReceiptImage(
    currentUser: LoginUserDto,
    highwayFeeNo: number,
    receiptImage: Express.Multer.File,
  ) {
    const highwayFee = await this.tHighwayFeeRepository.findOneOrThrow(
      {
        relations: this.getHighwayFeeRelations(currentUser.roleDiv),
        where: {
          highwayFeeNo,
        },
      },
      TRN_CRS011_001Exception,
      `highway fee not found with highwayFeeNo: ${highwayFeeNo}`,
    );

    const manageHighwayFeeAbility =
      this.userAbilityFactory.defineManageHighwayFee(currentUser);

    if (manageHighwayFeeAbility.cannot(AbilityAction.MANAGE, highwayFee)) {
      throw new TRN_CRS011_001Exception(
        "don't have permission to create this receipt image",
      );
    }

    const extension = path.extname(receiptImage.originalname);
    const blobName = `receipt-images/${Date.now()}_${randomUUID()}${extension}`;

    const uploadResponse = await this.blobStorageService.uploadBlobData(
      blobName,
      receiptImage.buffer,
      { blobContentType: receiptImage.mimetype },
    );

    const highwayFeeReceiptImage =
      this.tHighwayFeeReceiptImageRepository.create({
        highwayFeeNo,
        receiptImage: uploadResponse._response.request.url,
      });

    return this.tHighwayFeeReceiptImageRepository.save(highwayFeeReceiptImage);
  }

  async deleteReceiptImage(currentUser: LoginUserDto, imageNo: number) {
    const receiptImage =
      await this.tHighwayFeeReceiptImageRepository.findOneOrThrow(
        {
          relations: {
            tHighwayFee: this.getHighwayFeeRelations(currentUser.roleDiv),
          },
          where: { imageNo },
        },
        TRN_CRS011_002Exception,
        `receipt image not found with imageNo: ${imageNo}`,
      );
    if (!receiptImage.receiptImage) {
      throw new TRN_CRS011_002Exception(
        `receipt image url not found with imageNo: ${imageNo}`,
      );
    }

    const highwayFee = receiptImage.tHighwayFee;

    const manageHighwayFeeAbility =
      this.userAbilityFactory.defineManageHighwayFee(currentUser);

    if (manageHighwayFeeAbility.cannot(AbilityAction.MANAGE, highwayFee)) {
      throw new TRN_CRS011_002Exception(
        "don't have permission to delete this receipt image",
      );
    }

    const blobName = this.blobStorageService.getBlobNameFromUrl(
      receiptImage.receiptImage,
    );
    await this.blobStorageService.deleteBlobIfExists(blobName);

    return this.tHighwayFeeReceiptImageRepository.remove(receiptImage);
  }

  private getHighwayFeeRelations(
    roleDiv: RoleDiv,
  ): FindOptionsRelations<THighwayFeeEntity> {
    if (roleDiv === RoleDiv.TRANSPORT_COMPANY) {
      return { tCourse: true };
    }

    if (roleDiv === RoleDiv.CARRIAGE_COMPANY) {
      return { tCourse: { driver: true } };
    }

    return {};
  }
}

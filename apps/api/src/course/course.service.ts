import { UserAbilityFactory } from '@api/auth/casl/userAbility.factory';
import { LoginUserDto } from '@app/common/dtos/loginUser.dto';
import { TRN_CRS002_001Exception } from '@app/common/filters/exceptions/TRN_CRS002_001.exception';
import { TRN_CRS004_001Exception } from '@app/common/filters/exceptions/TRN_CRS004_001.exception';
import { TRN_CRS005_001Exception } from '@app/common/filters/exceptions/TRN_CRS005_001.exception';
import { TRN_CRS010_001Exception } from '@app/common/filters/exceptions/TRN_CRS010_001.exception';
import { TRN_CRS011_005Exception } from '@app/common/filters/exceptions/TRN_CRS011_005.exception';
import { TRN_CRS013_001Exception } from '@app/common/filters/exceptions/TRN_CRS013_001.exception';
import { TRN_CRS014_001Exception } from '@app/common/filters/exceptions/TRN_CRS014_001.exception';
import { TRN_CRS015_001Exception } from '@app/common/filters/exceptions/TRN_CRS015_001.exception';
import { TRN_CRS016_001Exception } from '@app/common/filters/exceptions/TRN_CRS016_001.exception';
import { TRN_CRS022_001Exception } from '@app/common/filters/exceptions/TRN_CRS022_001.exception';
import { TRN_CRS022_002Exception } from '@app/common/filters/exceptions/TRN_CRS022_002.exception';
import { BlobStorageService } from '@app/common/services/blobStorage.service';
import {
  AbilityAction,
  AppEventPattern,
  AppService,
  OrderBy,
  ParameterSearchMappings,
} from '@app/common/types/common.type';
import {
  DeliveryStatusDiv,
  DispatchStatusDiv,
  DivCd,
  RoleDiv,
  StatusDiv,
} from '@app/common/types/div.type';
import { ClassConstructor, FindOneByParams } from '@app/common/types/util.type';
import { getPagination } from '@app/common/utils/getPagination.util';
import {
  searchQueryParams,
  sortQueryParams,
} from '@app/common/utils/handleGetListRecords';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MDivValueEntity } from '@app/database/entities/mDivValue.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MCourseRepository } from '@app/database/repositories/mCourse.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { THighwayFeeRepository } from '@app/database/repositories/tHighwayFee.repository';
import { TSpotRepository } from '@app/database/repositories/tSpot.repository';
import { TTripRepository } from '@app/database/repositories/tTrip.repository';
import { AssignSpotsTransaction } from '@app/database/transactions/assignSpots.transaction';
import { UnassignSpotsTransaction } from '@app/database/transactions/unassignSpots.transaction';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import archiver, { Archiver } from 'archiver';
import moment from 'moment';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { map } from 'rxjs';
import {
  And,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  SelectQueryBuilder,
} from 'typeorm';
import { AssignCarAndDriverBodyDto } from './dtos/assignCarAndDriverBody.dto';
import { AssignCarAndDriverParamDto } from './dtos/assignCarAndDriverParam.dto';
import { AssignSpotsToCoursesBodyDto } from './dtos/assignSpotsToCoursesBody.dto';
import { CreateCourseBodyDto } from './dtos/createCourseBody.dto';
import { CreateCourseFrameBodyDto } from './dtos/createCourseFrameBody.dto';
import { DownloadSignboardPhotosQuery } from './dtos/downloadSignboardPhotosQuery.dto';
import { GetCourseAssignedQueryDto } from './dtos/getCourseAssignedQuery.dto';
import { mappingCourseAssigned } from './dtos/getCourseAssignedResponse.dto';
import { GetCoursesQueryDto } from './dtos/getCourseQuery.dto';
import { mappingCourseDetail } from './dtos/getCourseResponse.dto';
import { GetListCoursesQueryDto } from './dtos/getListCourseQuery.dto';
import { GetListMasterCourseQueryDto } from './dtos/getListMasterCourseQuery.dto';
import { GetListSingleCourseQueryDto } from './dtos/getListSingleCourseQuery.dto';
import { mappingSingleCourseDetail } from './dtos/getSingleCourseDetailResponse.dto';
import { UnassignSpotsBodyDto } from './dtos/unassignSpotsBody.dto';
import { UpdateCourseMemoBodyDto } from './dtos/updateCourseMemoBody.dto';
import { UpdateCourseBodyDto } from './dtos/updateCourseBody.dto';
import { UpdateCourseParamDto } from './dtos/updateCourseParam.dto';
import { UpdateCourseStatusBodyDto } from './dtos/updateCourseStatusBody.dto';
import { UpdateListStatusCourseBody } from './dtos/updateListStatusCourseBody.dto';
import { Readable } from 'node:stream';
import { GetCountImageCourseQueryDto } from './dtos/getCountImageCourseQuery.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly userAbilityFactory: UserAbilityFactory,
    @Inject(AppService.BATCH_SERVICE) private readonly client: ClientProxy,
    private readonly assignSpotsTransaction: AssignSpotsTransaction,
    private readonly unassignSpotsTransaction: UnassignSpotsTransaction,
    private readonly blobStorageService: BlobStorageService,

    private readonly tCourseRepository: TCourseRepository,
    private readonly tTripRepository: TTripRepository,
    private readonly tSpotRepository: TSpotRepository,
    private readonly mCourseRepository: MCourseRepository,
    private readonly mCarRepository: MCarRepository,
    private readonly mDriverRepository: MDriverRepository,
    private readonly mUserRepository: MUserRepository,
    private readonly tHighwayFeeRepository: THighwayFeeRepository,
    private readonly mBaseRepository: MBaseRepository,
  ) {}

  async getListCourses(
    listCoursesQuery: GetListCoursesQueryDto,
    currentUser: LoginUserDto,
  ) {
    const {
      page,
      limit,
      sort,
      slipNo,
      serviceStartYmd,
      serviceEndYmd,
      serviceDivYmd,
      startBaseId,
      arriveBaseId,
      courseId,
      deliveryStatus,
      driver,
      transportCompanyId,
    } = listCoursesQuery;

    const skip = (page - 1) * limit;
    const currentDate = moment().format('YYYY-MM-DD');
    const tomorrow = moment().add(1, 'd').format('YYYY-MM-DD');

    const parentCompanyId = await this.mUserRepository.getUserParentCompanyId(
      currentUser.mUserId,
    );

    const tripNotAssigned = await this.tTripRepository.count({
      where: {
        serviceYmd: currentDate,
        courseSeqNo: IsNull(),
        ...(currentUser.roleDiv === RoleDiv.TRANSPORT_COMPANY
          ? { tSlipHeader: { carrierId: currentUser.transportCompanyId } }
          : {}),

        ...(currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY
          ? { tSlipHeader: { carrierId: parentCompanyId } }
          : {}),
      },
    });

    const queryBuilder = this.tCourseRepository
      .createQueryBuilder('tCourse')
      .leftJoin('tCourse.course', 'course')
      .leftJoin('tCourse.transportCompany', 'transportCompany')
      .leftJoin('tCourse.car', 'car')
      .leftJoin('tCourse.driver', 'driver')
      .leftJoin('driver.transportCompany', 'carriageCompany')
      .leftJoin('tCourse.startBase', 'startBase')
      .leftJoin('tCourse.arriveBase', 'arriveBase')
      .leftJoin(
        sq =>
          sq
            .select('highwayFees.courseSeqNo as subCourseSeqNo')
            .addSelect('SUM(highwayFees.amount) as sumHigh')
            .from(THighwayFeeEntity, 'highwayFees')
            .groupBy('subCourseSeqNo'),
        'subHigh',
        'subHigh.subCourseSeqNo = tCourse.courseSeqNo',
      )
      .leftJoin(
        sq =>
          sq
            .select('trip.courseSeqNo as subCourseSeqNo')
            .addSelect('COUNT(trip.tripId) as totalSlip')
            .addSelect('GROUP_CONCAT(trip.slipNo) as listSlipNo')
            .addSelect(
              `COUNT(CASE WHEN DATE_FORMAT(trip.regiDatetime, '%x-%c-%d') = subTCourse.serviceYmd THEN 1 ELSE NULL END) as specialDateSlip`,
            )
            .addSelect('COUNT(DISTINCT(trip.arriveBaseId)) as visitedCases')
            .addSelect(
              'COUNT(CASE WHEN spots.statusDiv = "03" THEN spots.spotId ELSE NULL END) as numReturnedSlip',
            )
            .addSelect(
              'COUNT(CASE WHEN spots.statusDiv = "01" THEN spots.spotId ELSE NULL END) as unfinishSlip',
            )
            .from(TTripEntity, 'trip')
            .leftJoin('trip.tSpots', 'spots')
            .leftJoin('trip.tCourse', 'subTCourse')
            .groupBy('subCourseSeqNo'),
        'subTrip',
        'subTrip.subCourseSeqNo = tCourse.courseSeqNo',
      )
      .select([
        'tCourse.courseId as courseId',
        'tCourse.serviceYmd as serviceYmd',
        'course.courseNm as courseNo',
        'MIN(tCourse.deliveryStatusDiv) as deliveryStatusDiv',
        'MAX(tCourse.dispatchStatusDiv) as dispatchStatusDiv',
        'MAX(tCourse.startTime) as startTime',
        'MAX(tCourse.endTime) as endTime',
        'MAX(tCourse.transportCompanyId) as transportCompanyId',
        'MAX(tCourse.driverId) as driverId',
        'MAX(tCourse.carId) as carId',
        'MAX(transportCompany.transportCompanyNm) as deliveryCompany',
        'MAX(carriageCompany.transportCompanyNm) as carriageCompany',
        'MAX(car.carManagementNum) as carManagementNum',
        'MAX(driver.driverNm) as driverNm',
        'MAX(startBase.baseNm1) as startPoint',
        'MAX(arriveBase.baseNm1) as arrivePoint',
        `SUM(
            CASE WHEN
              tCourse.signboardPhoto1 IS NULL AND
              tCourse.signboardPhoto2 IS NULL AND
              tCourse.signboardPhoto3 IS NULL AND
              tCourse.signboardPhoto4 IS NULL AND
              tCourse.signboardPhoto5 IS NULL AND
              tCourse.signboardPhoto6 IS NULL
            THEN 0 ELSE 1 END)
          as signboardPhoto`,
        'COALESCE(SUM(subHigh.sumHigh), 0) as highwayFee',
        'COUNT(DISTINCT(tCourse.courseSeqNo)) as courseCount',
        'COALESCE(SUM(subTrip.totalSlip), 0) as totalSlip',
        'COALESCE(SUM(subTrip.specialDateSlip), 0) as specialDateSlip',
        'COALESCE(SUM(subTrip.visitedCases), 0) as visitedCases',
        'COALESCE(SUM(subTrip.numReturnedSlip), 0) as numReturnedSlip',
        'COALESCE(SUM(subTrip.unfinishSlip), 0) as unfinishSlip',
      ])
      .setParameter('status', '03')
      .addSelect(subQuery => {
        const deliveryStatusDivNm = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCdDeliveryStatus', {
            divCdDeliveryStatus: DivCd.DELIVERY_STATUS_DIV,
          })
          .andWhere('mDivValue.divValue = MIN(tCourse.deliveryStatusDiv)')
          .limit(1);
        return deliveryStatusDivNm;
      }, 'deliveryStatusDivNm')
      .addSelect(subQuery => {
        const dispatchStatusDivNm = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :divCdDispatchStatus', {
            divCdDispatchStatus: DivCd.DISPATCH_STATUS_DIV,
          })
          .andWhere('mDivValue.divValue = MAX(tCourse.dispatchStatusDiv)')
          .limit(1);
        return dispatchStatusDivNm;
      }, 'dispatchStatusDivNm')
      .groupBy('courseId, serviceYmd');

    const queryBuilderByRole = this.queryBuilderSearchByRole(
      currentUser,
      queryBuilder,
    );

    const parameterMappings: ParameterSearchMappings[] = [
      {
        queryParam: 'slipNo',
        field: 'subTrip.listSlipNo',
        operator: 'like',
        pattern: slipNo?.replaceAll(',', ' '),
      },
      {
        queryParam: 'driver',
        field: 'driver.driverNm',
        operator: 'like',
        pattern: driver,
      },
      {
        queryParam: 'startBaseId',
        field: 'tCourse.startBaseId',
        operator: '=',
        value: startBaseId,
      },
      {
        queryParam: 'arriveBaseId',
        field: 'tCourse.arriveBaseId',
        operator: '=',
        value: arriveBaseId,
      },
      {
        queryParam: 'courseId',
        field: 'tCourse.courseId',
        operator: '=',
        value: courseId,
      },
      {
        queryParam: 'transportCompanyId',
        field: 'tCourse.transportCompanyId',
        operator: '=',
        value: transportCompanyId,
      },
      {
        queryParam: 'deliveryStatus',
        field: 'tCourse.deliveryStatusDiv',
        operator: 'IN',
        value: deliveryStatus,
      },
    ];

    switch (serviceDivYmd) {
      case '00':
        const searchServiceYmdMode0: ParameterSearchMappings[] = [
          {
            queryParam: 'serviceYmd',
            field: 'tCourse.serviceYmd',
            operator: '>=',
            value: currentDate,
          },
          {
            queryParam: 'serviceEndYmd',
            field: 'tCourse.serviceYmd',
            operator: '<=',
            value: tomorrow,
          },
        ];
        parameterMappings.push(...searchServiceYmdMode0);
        break;

      case '02':
        const searchServiceYmdMode2: ParameterSearchMappings = {
          queryParam: 'serviceYmd',
          field: 'tCourse.serviceYmd',
          operator: '>=',
          value: currentDate,
        };
        parameterMappings.push(searchServiceYmdMode2);
        break;

      case '03':
        const searchServiceYmdMode3: ParameterSearchMappings[] = [
          {
            queryParam: 'serviceStartYmd',
            field: 'tCourse.serviceYmd',
            operator: '>=',
            value: serviceStartYmd,
          },
          {
            queryParam: 'serviceEndYmd',
            field: 'tCourse.serviceYmd',
            operator: '<=',
            value: serviceEndYmd,
          },
        ];
        parameterMappings.push(...searchServiceYmdMode3);
        break;

      default:
        break;
    }

    const searchQueryBuilder = searchQueryParams(
      queryBuilderByRole,
      parameterMappings,
    );

    if (!('serviceYmd' in sort)) {
      sort['serviceYmd'] = OrderBy.DESC;
    }

    if (!('courseId' in sort)) {
      sort['courseId'] = OrderBy.ASC;
    }

    const sortQueryBuilder = sortQueryParams(searchQueryBuilder, sort);

    const totalCount = (await sortQueryBuilder.getRawMany()).length;

    sortQueryBuilder.limit(limit).offset(skip);

    const results = await sortQueryBuilder.getRawMany();

    return {
      results,
      pagination: getPagination(results.length, totalCount, page, limit),
      tripNotAssigned,
    };
  }

  async getCourseDetail(
    coursesQuery: GetCoursesQueryDto,
    currentUser: LoginUserDto,
  ) {
    const { serviceYmd, courseId } = coursesQuery;
    const courseRecords = await this.tCourseRepository
      .createQueryBuilder('tCourse')
      .where('tCourse.courseId = :courseId', { courseId })
      .andWhere('tCourse.serviceYmd = :serviceYmd', { serviceYmd })
      .leftJoinAndSelect('tCourse.course', 'course')
      .leftJoinAndSelect('tCourse.transportCompany', 'transportCompany')
      .leftJoinAndSelect('transportCompany.parentCompany', 'parentCompany')
      .leftJoinAndSelect('tCourse.car', 'car')
      .leftJoinAndSelect('tCourse.driver', 'driver')
      .leftJoinAndSelect('tCourse.startBase', 'startBase')
      .leftJoinAndSelect('tCourse.arriveBase', 'arriveBase')
      .leftJoinAndSelect('tCourse.tHighwayFees', 'tHighwayFees')
      .getMany();

    if (courseRecords.length === 0) return {};

    this.checkRoleAccessCourseDetail(
      courseRecords,
      currentUser,
      courseId,
      serviceYmd,
    );

    const listCourseSeqNo = courseRecords
      .map(obj => obj.courseSeqNo)
      .filter(courseSeqNo => courseSeqNo !== null);

    const highwayFeeRecords = await this.getHighwayFees(listCourseSeqNo);
    const spotRecords = await this.getSpots(listCourseSeqNo);

    return mappingCourseDetail(
      courseRecords.map(record => {
        record.signboardPhoto1 = this.getPublicImageUrl(record.signboardPhoto1);
        record.signboardPhoto2 = this.getPublicImageUrl(record.signboardPhoto2);
        record.signboardPhoto3 = this.getPublicImageUrl(record.signboardPhoto3);
        record.signboardPhoto4 = this.getPublicImageUrl(record.signboardPhoto4);
        record.signboardPhoto5 = this.getPublicImageUrl(record.signboardPhoto5);
        record.signboardPhoto6 = this.getPublicImageUrl(record.signboardPhoto6);

        return record;
      }),
      highwayFeeRecords.map(record => {
        record.tHighwayFeeReceiptImages = record.tHighwayFeeReceiptImages.map(
          highwayFeeImage => {
            highwayFeeImage.receiptImage = highwayFeeImage.receiptImage
              ? this.blobStorageService.generatePublicUrl(
                  highwayFeeImage.receiptImage,
                )
              : highwayFeeImage.receiptImage;

            return highwayFeeImage;
          },
        );

        return record;
      }),
      spotRecords.map(record => {
        record.trip.tSlipHeader.electronicSignatureImage =
          this.getPublicImageUrl(
            record.trip.tSlipHeader.electronicSignatureImage,
          );
        record.trip.tSlipHeader.image1 = this.getPublicImageUrl(
          record.trip.tSlipHeader.image1,
        );
        record.trip.tSlipHeader.image2 = this.getPublicImageUrl(
          record.trip.tSlipHeader.image2,
        );
        record.trip.tSlipHeader.image3 = this.getPublicImageUrl(
          record.trip.tSlipHeader.image3,
        );
        record.trip.tSlipHeader.image4 = this.getPublicImageUrl(
          record.trip.tSlipHeader.image4,
        );
        record.trip.tSlipHeader.image5 = this.getPublicImageUrl(
          record.trip.tSlipHeader.image5,
        );

        return record;
      }),
    );
  }

  private checkRoleAccessCourseDetail(
    courseRecords: TCourseEntity[],
    currentUser: LoginUserDto,
    courseId: number,
    serviceYmd: string,
  ) {
    let isForbidden = false;

    switch (currentUser.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
        isForbidden = courseRecords.some(
          item => item.transportCompanyId !== currentUser.transportCompanyId,
        );
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        isForbidden = courseRecords.some(
          item =>
            item.driver?.transportCompanyId !== currentUser.transportCompanyId,
        );
        break;

      default:
        break;
    }

    if (isForbidden) {
      throw new TRN_CRS004_001Exception(
        `course not found with courseId=${courseId} & serviceYmd=${serviceYmd}`,
      );
    }
  }

  private async getHighwayFees(
    listCourseSeqNo: number[],
  ): Promise<THighwayFeeEntity[]> {
    const highwayFeeRecords = await this.tHighwayFeeRepository
      .createQueryBuilder('tHighwayFee')
      .leftJoinAndSelect(
        'tHighwayFee.tHighwayFeeReceiptImages',
        'tHighwayFeeReceiptImages',
      )
      .where('tHighwayFee.courseSeqNo IN (:...listCourseSeqNo)', {
        listCourseSeqNo,
      })
      .getMany();

    return highwayFeeRecords;
  }

  private async getSpots(listCourseSeqNo: number[]): Promise<TSpotEntity[]> {
    let spotRecords: TSpotEntity[] = [];

    const tripsRecords = await this.tTripRepository.find({
      where: {
        courseSeqNo: In(listCourseSeqNo),
      },
      select: ['tripId'],
    });

    if (tripsRecords.length > 0) {
      const listTripId = tripsRecords.map(item => item.tripId);

      spotRecords = await this.tSpotRepository
        .createQueryBuilder('tSpot')
        .leftJoinAndSelect('tSpot.trip', 'trip')
        .leftJoinAndSelect('trip.tSlipHeader', 'tSlipHeader')
        .leftJoinAndSelect('tSpot.base', 'base')
        .leftJoinAndMapOne(
          'tSlipHeader.receivingWarehouseBase',
          MBaseEntity,
          'mBaseReceivingWarehouse',
          `mBaseReceivingWarehouse.baseCd = tSlipHeader.receivingWarehouseCd and mBaseReceivingWarehouse.baseDiv = '01'`,
        )
        .leftJoinAndMapOne(
          'tSlipHeader.tSlipHeaderForPurchaseOrder',
          TSlipHeaderEntity,
          'tSlipHeaderForPurchaseOrder',
          'tSlipHeaderForPurchaseOrder.slipNoForPurchaseOrder = tSlipHeader.slipNo',
        )
        .withDeleted()
        .leftJoinAndSelect('tSlipHeader.tSlipDetails', 'tSlipDetails')
        .leftJoinAndSelect(
          'tSlipDetails.tSlipDeadlines',
          'tSlipDeadlines',
          'tSlipDeadlines.deleteAt IS NULL',
        )
        .where('tSpot.tripId IN (:...listTripId)', {
          listTripId,
        })
        .getMany();
    }

    return spotRecords;
  }

  async getCourseAssigned(
    coursesQuery: GetCourseAssignedQueryDto,
    currentUser: LoginUserDto,
  ) {
    const {
      serviceYmd,
      courseId,
      deliveryStatus,
      dispatchStatus,
      startBaseId,
    } = coursesQuery;
    const queryBuilder = this.tCourseRepository
      .createQueryBuilder('tCourse')
      .leftJoinAndSelect('tCourse.course', 'course')
      .leftJoinAndSelect('tCourse.transportCompany', 'transportCompany')
      .leftJoinAndSelect('transportCompany.parentCompany', 'parentCompany')
      .leftJoinAndSelect('tCourse.car', 'car')
      .leftJoinAndSelect('tCourse.driver', 'driver')
      .leftJoinAndSelect('tCourse.startBase', 'startBase')
      .leftJoinAndSelect('tCourse.arriveBase', 'arriveBase')
      .leftJoinAndSelect('tCourse.tTrips', 'tTrips')
      .leftJoinAndSelect('tTrips.tSpots', 'tSpots')
      .leftJoinAndSelect('tSpots.trip', 'trip')
      .leftJoinAndSelect('trip.tSlipHeader', 'tSlipHeader')
      .leftJoinAndSelect('tSpots.base', 'base')
      .leftJoinAndMapOne(
        'tSlipHeader.receivingWarehouseBase',
        MBaseEntity,
        'mBaseReceivingWarehouse',
        `mBaseReceivingWarehouse.baseCd = tSlipHeader.receivingWarehouseCd and mBaseReceivingWarehouse.baseDiv = '01'`,
      )
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
      .withDeleted()
      .leftJoinAndSelect('tSlipHeader.tSlipDetails', 'tSlipDetails')
      .leftJoinAndSelect(
        'tSlipDetails.tSlipDeadlines',
        'tSlipDeadlines',
        'tSlipDeadlines.deleteAt IS NULL',
      );

    const queryBuilderByRole = this.queryBuilderSearchByRole(
      currentUser,
      queryBuilder,
    );

    const parameterMappings: ParameterSearchMappings[] = [
      {
        queryParam: 'courseId',
        field: 'tCourse.courseId',
        operator: 'IN',
        value: courseId,
      },
      {
        queryParam: 'serviceYmd',
        field: 'tCourse.serviceYmd',
        operator: '=',
        value: serviceYmd,
      },
      {
        queryParam: 'deliveryStatus',
        field: 'tCourse.deliveryStatusDiv',
        operator: '=',
        value: deliveryStatus,
      },
      {
        queryParam: 'dispatchStatus',
        field: 'tCourse.dispatchStatusDiv',
        operator: '=',
        value: dispatchStatus,
      },
      {
        queryParam: 'startBaseId',
        field: 'tCourse.startBaseId',
        operator: '=',
        value: startBaseId,
      },
    ];

    const searchQueryBuilder = searchQueryParams(
      queryBuilderByRole,
      parameterMappings,
    );
    const execQueryBuilder = searchQueryBuilder.andWhere(
      'tCourse.deleteAt is null'
    )

    const courseRecords = await execQueryBuilder.getMany();

    return mappingCourseAssigned(courseRecords);
  }

  private queryBuilderSearchByRole(
    currentUser: LoginUserDto,
    queryBuilder: SelectQueryBuilder<any>,
  ): SelectQueryBuilder<any> {
    switch (currentUser.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
        queryBuilder.andWhere(
          'tCourse.transportCompanyId = :currentTransportCompanyId',
          {
            currentTransportCompanyId: currentUser.transportCompanyId,
          },
        );
        break;

      case RoleDiv.CARRIAGE_COMPANY:
        queryBuilder.andWhere(
          'driver.transportCompanyId = :currentTransportCompanyId',
          {
            currentTransportCompanyId: currentUser.transportCompanyId,
          },
        );
        break;
      default:
        break;
    }
    return queryBuilder;
  }

  async createCourse(currentUser: LoginUserDto, body: CreateCourseBodyDto) {
    const { courseId, serviceYmd, carId, driverId } = body;

    await this.tCourseRepository.findExistAndThrow(
      {
        courseId,
        serviceYmd,
      },
      TRN_CRS014_001Exception,
      `course with courseId: ${courseId} and serviceYmd: ${serviceYmd} already exists`,
    );

    const mCourse = await this.mCourseRepository.findOneByOrThrow(
      {
        courseId,
      },
      TRN_CRS014_001Exception,
      `master course not found with courseId: ${courseId}`,
    );

    const course = this.tCourseRepository.create({
      ...body,
      dispatchStatusDiv: DispatchStatusDiv.UNCONFIRMED,
      deliveryStatusDiv: DeliveryStatusDiv.UNFINISHED,
      startTime: mCourse.serviceStartTime,
      endTime: mCourse.serviceEndTime,
      startBaseId: mCourse.startBaseId,
      arriveBaseId: mCourse.arriveBaseId,
      transportCompanyId: mCourse.transportCompanyId,
    });

    await this.checkManageCourseOrFail(currentUser, course).catch(() => {
      throw new TRN_CRS014_001Exception(
        `don't have permissions to get create this course`,
      );
    });

    await this.checkAssignCarAndDriverOrThrow(
      currentUser,
      { carId, driverId },
      mCourse.transportCompanyId,
      TRN_CRS014_001Exception,
    );

    return this.tCourseRepository.save(course);
  }

  async createCourseFrame(
    currentUser: LoginUserDto,
    body: CreateCourseFrameBodyDto,
  ) {
    const { courseId, serviceYmd } = body;

    await this.tCourseRepository.findExistAndThrow(
      {
        courseId,
        serviceYmd,
        deliveryStatusDiv: DeliveryStatusDiv.UNFINISHED,
      },
      TRN_CRS002_001Exception,
      `course existed with courseId: ${courseId} and serviceYmd: ${serviceYmd} have deliveryStatusDiv ${DeliveryStatusDiv.UNFINISHED}`,
    );

    const baseTCourse = await this.tCourseRepository.findOneOrThrow(
      {
        where: {
          courseId,
          serviceYmd,
          deliveryStatusDiv: Not(DeliveryStatusDiv.UNFINISHED),
        },
        order: {
          actualStartTime: OrderBy.ASC,
        },
      },
      TRN_CRS002_001Exception,
      `course not found with courseId: ${courseId} and serviceYmd: ${serviceYmd}`,
    );

    await this.checkManageCourseOrFail(currentUser, baseTCourse).catch(() => {
      throw new TRN_CRS002_001Exception(
        `don't have permissions to create this course`,
      );
    });

    const course = this.tCourseRepository.create({
      courseId: baseTCourse.courseId,
      dispatchStatusDiv: baseTCourse.dispatchStatusDiv,
      deliveryStatusDiv: DeliveryStatusDiv.UNFINISHED,
      serviceYmd: baseTCourse.serviceYmd,
      startTime: baseTCourse.startTime,
      endTime: baseTCourse.endTime,
      startBaseId: baseTCourse.startBaseId,
      arriveBaseId: baseTCourse.arriveBaseId,
      transportCompanyId: baseTCourse.transportCompanyId,
      carId: baseTCourse.carId,
      driverId: baseTCourse.driverId,
      transitDistance: 0,
    });

    return this.tCourseRepository.save(course);
  }

  async updateDispatchStatusCourse(
    currentUser: LoginUserDto,
    courseSeqNo: number,
  ) {
    const course = await this.checkUpdateCourseOrThrow(
      currentUser,
      { courseSeqNo },
      TRN_CRS016_001Exception,
    );

    course.dispatchStatusDiv =
      course.dispatchStatusDiv === DispatchStatusDiv.CONFIRMED
        ? DispatchStatusDiv.UNCONFIRMED
        : DispatchStatusDiv.CONFIRMED;

    await this.tCourseRepository.save(course);

    return course.courseSeqNo;
  }

  async updateStatusEachCourse(
    courseList: TCourseEntity[],
    user: LoginUserDto,
    isComfirmed: boolean,
  ) {
    const listCourseSeq: number[] = [];

    for (const course of courseList) {
      if (courseList.indexOf(course) === 0) {
        const manageCourseAbility = this.userAbilityFactory.defineManageCourse(
          user,
          true,
        );

        if (manageCourseAbility.cannot(AbilityAction.UPDATE, course)) {
          throw new TRN_CRS016_001Exception(
            "don't have permission to update dispatch status this course",
          );
        }
      }

      course.dispatchStatusDiv = isComfirmed
        ? DispatchStatusDiv.UNCONFIRMED
        : DispatchStatusDiv.CONFIRMED;

      await this.tCourseRepository.save(course);

      listCourseSeq.push(course.courseSeqNo);
    }
    return listCourseSeq;
  }

  async updateDispatchStatusCourseList(
    user: LoginUserDto,
    body: UpdateListStatusCourseBody,
  ) {
    let courseResponse: number[] = [];

    for (const item of body.courseList) {
      const courseList = await this.tCourseRepository.find({
        relations: { driver: true },
        where: { serviceYmd: item.serviceYmd, courseId: item.courseId },
      });

      const isComfirmed = courseList.find(
        item => item.dispatchStatusDiv === DispatchStatusDiv.CONFIRMED,
      );

      const listCourseSeq = await this.updateStatusEachCourse(
        courseList,
        user,
        Boolean(isComfirmed),
      );

      courseResponse = [...courseResponse, ...listCourseSeq];
    }

    return courseResponse;
  }

  async updateSoftDeleteCourse(
    user: LoginUserDto,
    courseSeqNo: number,
  ) {
    let courseResponse: number[] = [];

    const queryBuilder = this.tCourseRepository
      .createQueryBuilder('tCourse')
      .where('tCourse.courseSeqNo = :courseSeqNo', {
        courseSeqNo,
      })

    const course = await queryBuilder.getOne();

    if (!course) {
      throw new TRN_CRS013_001Exception(
        `not found course with courseSeqNo ${courseSeqNo}`,
      );
    }
    const manageCourseAbility = this.userAbilityFactory.defineManageCourse(
      user,
      true,
    );

    if (manageCourseAbility.cannot(AbilityAction.UPDATE, course)) {
      throw new TRN_CRS022_001Exception(
        "don't have permission to update dispatch status this course",
      );
    }

    if (course.deliveryStatusDiv !== DeliveryStatusDiv.UNFINISHED) {
      throw new TRN_CRS022_002Exception(
        "Not in a status that can be deleted",
      );
    }
    const trips = await this.tTripRepository.createQueryBuilder('tTrip')
      .andWhere('tTrip.courseSeqNo = :courseSeqNo', {
        courseSeqNo,
      }).getMany();

    trips.forEach(
      (item: any) => (item.courseSeqNo = null),
    );

    await Promise.all([
      this.tCourseRepository.softRemove(course),
      this.tTripRepository.save(trips),
    ]);

    courseResponse.push(course.courseSeqNo);

    return courseResponse;
  }

  async getListMasterCourses(
    user: LoginUserDto,
    query: GetListMasterCourseQueryDto,
  ) {
    const listMCousre = this.mCourseRepository
      .createQueryBuilder('mCourse')
      .leftJoin('mCourse.startBase', 'startBase')
      .leftJoin('mCourse.arriveBase', 'arriveBase')
      .select([
        'mCourse.courseId as courseId',
        'mCourse.courseNm as courseNm',
        'mCourse.transportCompanyId as transportCompanyId',
        'mCourse.startBaseId as startBaseId',
        'startBase.baseNm1 as startBaseNm',
        'mCourse.arriveBaseId as arriveBaseId',
        'arriveBase.baseNm1 as arriveBaseNm',
        'mCourse.serviceStartTime as serviceStartTime',
        'mCourse.serviceEndTime as serviceEndTime',
        'mCourse.charterFlg as charterFlg',
      ])
      .where('mCourse.charterFlg = :charterFlag', {
        charterFlag: true,
      });

    switch (user.roleDiv) {
      case RoleDiv.TRANSPORT_COMPANY:
        listMCousre.andWhere(
          'mCourse.transportCompanyId = :transportCompanyId',
          {
            transportCompanyId: user.transportCompanyId,
          },
        );
        break;
      case RoleDiv.CARRIAGE_COMPANY:
        const parentCompanyId =
          await this.mUserRepository.getUserParentCompanyId(user.mUserId);

        listMCousre.andWhere('mCourse.transportCompanyId = :parentCompanyId', {
          parentCompanyId,
        });
        break;
      default:
        break;
    }

    if (query.signFlg === 'true') {
      const today = moment().format('YYYY-MM-DD');

      listMCousre.andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(TCourseEntity, 'tc')
          .where('tc.serviceYmd = :today', { today })
          .andWhere('tc.courseId = mCourse.courseId')
          .getQuery();
        return `NOT EXISTS ${subQuery}`;
      });
    }

    const result = await listMCousre.getRawMany();

    return result;
  }

  async assignCarAndDriver(
    currentUser: LoginUserDto,
    body: AssignCarAndDriverBodyDto,
    param: AssignCarAndDriverParamDto,
  ) {
    const course = await this.checkUpdateCourseOrThrow(
      currentUser,
      param,
      TRN_CRS005_001Exception,
    );

    await this.checkAssignCarAndDriverOrThrow(
      currentUser,
      body,
      course.transportCompanyId,
      TRN_CRS005_001Exception,
    );

    return this.updateListCourse(param, body);
  }

  async updateCourseMemo(
    currentUser: LoginUserDto,
    body: UpdateCourseMemoBodyDto,
    param: UpdateCourseParamDto,
  ) {
    const { memo } = body;

    await this.checkUpdateCourseOrThrow(
      currentUser,
      param,
      TRN_CRS015_001Exception,
    );
    return this.updateListCourse(param, body);
  }

  async updateCourse(
    currentUser: LoginUserDto,
    body: UpdateCourseBodyDto,
    param: UpdateCourseParamDto,
  ) {
    const { startBaseId, arriveBaseId } = body;

    await this.checkUpdateCourseOrThrow(
      currentUser,
      param,
      TRN_CRS015_001Exception,
    );

    if (startBaseId) {
      await this.mBaseRepository.findOneByOrThrow(
        {
          baseId: startBaseId,
        },
        TRN_CRS015_001Exception,
        `start base not found with baseId: ${startBaseId}`,
      );
    }

    if (arriveBaseId) {
      await this.mBaseRepository.findOneByOrThrow(
        {
          baseId: arriveBaseId,
        },
        TRN_CRS015_001Exception,
        `arrive base not found with baseId: ${arriveBaseId}`,
      );
    }

    return this.updateListCourse(param, body);
  }

  async updateCourseStatus(
    currentUser: LoginUserDto,
    courseSeqNo: number,
    body: UpdateCourseStatusBodyDto,
  ) {
    const { deliveryStatusDiv } = body;

    const course = await this.checkUpdateCourseOrThrow(
      currentUser,
      { courseSeqNo },
      TRN_CRS010_001Exception,
    );

    if (deliveryStatusDiv === DeliveryStatusDiv.FINISHED) {
      const unfinishedCourse = await this.tCourseRepository
        .createQueryBuilder('tCourse')
        .innerJoin('tCourse.tTrips', 'tTrip')
        .innerJoin('tTrip.tSpots', 'tSpot')
        .where('tCourse.courseSeqNo = :courseSeqNo', {
          courseSeqNo,
        })
        .andWhere('tSpot.statusDiv = :statusDiv', {
          statusDiv: StatusDiv.UNFINISHED,
        })
        .getOne();
      if (unfinishedCourse) {
        throw new TRN_CRS010_001Exception(
          `course with courseSeqNo: ${courseSeqNo} having unfinished spot`,
        );
      }
    }

    const actualTime = moment().format('HH:mm:ss');

    if (deliveryStatusDiv === DeliveryStatusDiv.RUNNING) {
      Object.assign(course, { ...body, actualStartTime: actualTime });
    }

    if (deliveryStatusDiv === DeliveryStatusDiv.FINISHED) {
      const { sum } = await this.tCourseRepository
        .createQueryBuilder('tCourse')
        .leftJoin('tCourse.tGpsActs', 'tGpsAct')
        .select('SUM(tGpsAct.distance)', 'sum')
        .where('tCourse.courseSeqNo = :courseSeqNo', { courseSeqNo })
        .getRawOne();

      Object.assign(course, {
        ...body,
        actualEndTime: actualTime,
        transitDistance: sum,
      });
    }

    return this.tCourseRepository.save(course);
  }

  private async checkUpdateCourseOrThrow(
    currentUser: LoginUserDto,
    where: FindOneByParams<TCourseEntity>,
    ErrorException: ClassConstructor = Error,
  ) {
    const course = await this.tCourseRepository.findOneOrThrow(
      {
        relations: { driver: currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY },
        where,
      },
      ErrorException,
      `not found course with ${JSON.stringify(where)}`,
    );

    const manageCourseAbility = this.userAbilityFactory.defineManageCourse(
      currentUser,
      true,
    );

    if (manageCourseAbility.cannot(AbilityAction.UPDATE, course)) {
      throw new ErrorException(
        `don't have permission to update course with ${JSON.stringify(where)}`,
      );
    }

    return course;
  }

  private async checkAssignCarAndDriverOrThrow(
    currentUser: LoginUserDto,
    body: AssignCarAndDriverBodyDto,
    courseCompanyId?: number,
    ErrorException: ClassConstructor = Error,
  ) {
    const { carId, driverId } = body;

    let carCompanyId: number | undefined;
    let driverCompanyId: number | undefined;

    if (carId) {
      const car = await this.mCarRepository.findOneOrThrow(
        {
          relations: {
            owningCompany: true,
          },
          where: { carId },
        },
        ErrorException,
        `car not found with carId: ${carId}`,
      );

      const manageCarAbility =
        this.userAbilityFactory.defineManageCar(currentUser);

      if (manageCarAbility.cannot(AbilityAction.READ, car)) {
        throw new ErrorException(
          `don't have permission to get car with carId: ${carId}`,
        );
      }

      if (
        car.owningCompanyId !== courseCompanyId &&
        car.owningCompany.parentCompanyId !== courseCompanyId
      ) {
        throw new ErrorException(
          `course's transport company ${courseCompanyId} is not match to car's owning company`,
        );
      }
    }

    if (driverId) {
      const driver = await this.mDriverRepository.findOneOrThrow(
        {
          relations: {
            transportCompany: true,
          },
          where: { driverId },
        },
        ErrorException,
        `driver not found with driverId: ${driverId}`,
      );

      const manageDriverAbility =
        this.userAbilityFactory.defineManageDriver(currentUser);

      if (manageDriverAbility.cannot(AbilityAction.READ, driver)) {
        throw new ErrorException(
          `don't have permission to get driver with driverId: ${driverId}`,
        );
      }

      if (
        driver.transportCompanyId !== courseCompanyId &&
        driver.transportCompany.parentCompanyId !== courseCompanyId
      ) {
        throw new ErrorException(
          `course's transport company ${courseCompanyId} is not match to driver's transport company`,
        );
      }
    }

    if (carCompanyId && driverCompanyId && carCompanyId !== driverCompanyId) {
      throw new ErrorException(
        `car's owningCompanyId: ${carCompanyId} is not match to driver's transportCompanyId: ${driverCompanyId}`,
      );
    }
  }

  private async updateListCourse(
    param: UpdateCourseParamDto,
    body: Partial<TCourseEntity>,
  ) {
    const { courseId, serviceYmd } = param;

    const courses = await this.tCourseRepository.findBy({
      courseId,
      serviceYmd,
    });

    courses.forEach(course => Object.assign(course, body));
    return this.tCourseRepository.save(courses);
  }

  async getCountImageCourse(
    currentUser: LoginUserDto,
    query: GetCountImageCourseQueryDto,
  ) {
    const listCourse = await this.tCourseRepository.findBy({
      serviceYmd: And(
        MoreThanOrEqual(query.serviceYmdStart),
        LessThanOrEqual(query.serviceYmdEnd),
      ),
      ...(currentUser.roleDiv === RoleDiv.TRANSPORT_COMPANY
        ? { transportCompanyId: currentUser.transportCompanyId }
        : {}),

      ...(currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY
        ? { driver: { transportCompanyId: currentUser.transportCompanyId } }
        : {}),
    });

    const countImage = listCourse.reduce(
      (total, value) =>
        total +
        +Boolean(value.signboardPhoto1) +
        +Boolean(value.signboardPhoto2) +
        +Boolean(value.signboardPhoto3) +
        +Boolean(value.signboardPhoto4) +
        +Boolean(value.signboardPhoto5) +
        +Boolean(value.signboardPhoto6),
      0,
    );

    return { countImage };
  }

  async getListSingleCourse(
    user: LoginUserDto,
    coursesQuery: GetListSingleCourseQueryDto,
  ) {
    const { serviceYmd } = coursesQuery;

    const queryBuilder = this.tCourseRepository
      .createQueryBuilder('tCourse')
      .leftJoin('tCourse.course', 'course')
      .select([
        'tCourse.courseSeqNo as courseSeqNo',
        'course.courseNm as courseNm',
        'tCourse.serviceYmd as serviceYmd',
        'tCourse.startTime as startTime',
        'tCourse.endTime as endTime',
        'tCourse.dispatchStatusDiv as dispatchStatusDiv',
        'CASE WHEN DATE(tCourse.serviceYmd) = DATE(tCourse.regiDatetime) THEN TRUE ELSE FALSE END AS selectDayFlg',
      ])
      .addSelect(subQuery => {
        const dispatchStatus = subQuery
          .select('mDivValue.divValueNm')
          .from(MDivValueEntity, 'mDivValue')
          .where('mDivValue.divCd = :dispatchStatusDivCd', {
            dispatchStatusDivCd: DivCd.DISPATCH_STATUS_DIV,
          })
          .andWhere('mDivValue.divValue = tCourse.dispatchStatusDiv')
          .limit(1);

        return dispatchStatus;
      }, 'dispatchStatusDivNm')
      .where('tCourse.driverId = :driverId', { driverId: user.driverId });

    if (serviceYmd) {
      queryBuilder.andWhere('tCourse.serviceYmd = :serviceYmd', {
        serviceYmd,
      });
    }

    const results = await queryBuilder.getRawMany();

    return results;
  }

  autoCreateCourse() {
    return this.client
      .emit(AppEventPattern.Batch.AUTO_CREATE_COURSE, {})
      .pipe(map(() => null));
  }

  updateCourseDeliveryStatus() {
    return this.client
      .emit(AppEventPattern.Batch.UPDATE_COURSE_DELIVERY_STATUS, {})
      .pipe(map(() => null));
  }

  deletePastGpsAct() {
    return this.client
      .emit(AppEventPattern.Batch.DELETE_PAST_GPS_ACT, {})
      .pipe(map(() => null));
  }

  async assignSpotsToCourses(
    currentUser: LoginUserDto,
    { courseList }: AssignSpotsToCoursesBodyDto,
  ) {
    return this.assignSpotsTransaction.run(courseList);
  }

  async unassignSpots({ spotList }: UnassignSpotsBodyDto) {
    return this.unassignSpotsTransaction.run(spotList);
  }

  async getSingleCourseDetail(courseSeqNo: number, currentUser: LoginUserDto) {
    const queryBuilder = this.tCourseRepository
      .createQueryBuilder('tCourse')
      .where('tCourse.courseSeqNo = :courseSeqNo', {
        courseSeqNo,
      })
      .leftJoinAndSelect('tCourse.transportCompany', 'transportCompany')
      .leftJoinAndSelect('tCourse.course', 'course')
      .leftJoinAndSelect('tCourse.driver', 'driver')
      .leftJoinAndSelect('tCourse.car', 'car')
      .leftJoinAndSelect('tCourse.startBase', 'startBase')
      .leftJoinAndSelect('tCourse.arriveBase', 'arriveBase')
      .leftJoinAndSelect('tCourse.tHighwayFees', 'tHighwayFees')
      .leftJoinAndSelect(
        'tHighwayFees.tHighwayFeeReceiptImages',
        'tHighwayFeeReceiptImages',
      );

    const course = await queryBuilder.getOne();

    if (!course) {
      throw new TRN_CRS013_001Exception(
        `not found course with courseSeqNo ${courseSeqNo}`,
      );
    }

    const manageCourseAbility = this.userAbilityFactory.defineManageCourse(
      currentUser,
      true,
    );

    if (manageCourseAbility.cannot(AbilityAction.READ, course)) {
      throw new TRN_CRS013_001Exception(
        `don't have permission to get course with courseSeqNo: ${courseSeqNo}`,
      );
    }

    const listSpots = await this.getSpotsSingle(courseSeqNo);

    course.tHighwayFees.forEach(highwayFee => {
      highwayFee.tHighwayFeeReceiptImages.forEach(highwayFeeImage => {
        highwayFeeImage.receiptImage = highwayFeeImage.receiptImage
          ? this.blobStorageService.generatePublicUrl(
              highwayFeeImage.receiptImage,
            )
          : highwayFeeImage.receiptImage;
      });
    });

    listSpots.forEach(spot => {
      spot.trip.tSlipHeader.image1 = this.getPublicImageUrl(
        spot.trip.tSlipHeader.image1,
      );
      spot.trip.tSlipHeader.image2 = this.getPublicImageUrl(
        spot.trip.tSlipHeader.image2,
      );
      spot.trip.tSlipHeader.image3 = this.getPublicImageUrl(
        spot.trip.tSlipHeader.image3,
      );
      spot.trip.tSlipHeader.image4 = this.getPublicImageUrl(
        spot.trip.tSlipHeader.image4,
      );
      spot.trip.tSlipHeader.image5 = this.getPublicImageUrl(
        spot.trip.tSlipHeader.image5,
      );
    });

    return mappingSingleCourseDetail(course, listSpots);
  }

  private async getSpotsSingle(courseSeqNo: number): Promise<TSpotEntity[]> {
    let spotRecords: TSpotEntity[] = [];

    const tripsRecords = await this.tTripRepository.find({
      where: {
        courseSeqNo,
      },
      select: ['tripId'],
    });

    if (tripsRecords.length > 0) {
      const listTripId = tripsRecords.map(item => item.tripId);

      spotRecords = await this.tSpotRepository
        .createQueryBuilder('tSpot')
        .leftJoinAndSelect('tSpot.trip', 'trip')
        .leftJoinAndSelect('trip.tSlipHeader', 'tSlipHeader')
        .leftJoinAndSelect('tSpot.base', 'base')
        .leftJoinAndMapOne(
          'tSlipHeader.receivingWarehouseBase',
          MBaseEntity,
          'mBaseReceivingWarehouse',
          `mBaseReceivingWarehouse.baseCd = tSlipHeader.receivingWarehouseCd and mBaseReceivingWarehouse.baseDiv = '01'`,
        )
        .leftJoinAndMapOne(
          'tSlipHeader.slipForPurchaseOrder',
          TSlipHeaderEntity,
          'tSlipHeaderEntity',
          `tSlipHeaderEntity.slipNo = tSlipHeader.slipNoForPurchaseOrder`,
        )
        .where('tSpot.tripId IN (:...listTripId)', {
          listTripId,
        })
        .getMany();
    }

    return spotRecords;
  }

  async createSignboardPhoto(
    currentUser: LoginUserDto,
    courseSeqNo: number,
    signboardPhoto: Express.Multer.File,
  ) {
    const course = await this.checkUpdateCourseOrThrow(
      currentUser,
      { courseSeqNo },
      TRN_CRS011_005Exception,
    );

    if (course.isFullPhoto()) {
      throw new TRN_CRS011_005Exception(`full of signboard photos`);
    }

    const extension = path.extname(signboardPhoto.originalname);
    const blobName = `delivery-images/${Date.now()}_${randomUUID()}${extension}`;

    const uploadResponse = await this.blobStorageService.uploadBlobData(
      blobName,
      signboardPhoto.buffer,
      { blobContentType: signboardPhoto.mimetype },
    );

    const photoProp = `signboardPhoto${course.getEmptyPhotoIndex()}` as const;

    course[photoProp] = uploadResponse._response.request.url;

    await this.tCourseRepository.save(course);

    return {
      [photoProp]: this.blobStorageService.generatePublicUrl(
        <string>course[photoProp],
      ),
    };
  }

  private async checkManageCourseOrFail(
    currentUser: LoginUserDto,
    course: TCourseEntity,
  ) {
    const parentCompanyId =
      currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY
        ? await this.mUserRepository.getUserParentCompanyId(currentUser.mUserId)
        : undefined;

    const manageMasterCourseAbility =
      this.userAbilityFactory.defineManageCourse({
        ...currentUser,
        parentCompanyId,
      });

    if (manageMasterCourseAbility.cannot(AbilityAction.MANAGE, course)) {
      throw new Error();
    }
  }

  private getPublicImageUrl(image?: string) {
    return image ? this.blobStorageService.generatePublicUrl(image) : image;
  }

  async downloadSignboardPhotos(
    currentUser: LoginUserDto,
    query: DownloadSignboardPhotosQuery,
  ) {
    const { serviceYmdFrom, serviceYmdTo } = query;

    const courses = await this.tCourseRepository.find({
      relations: {
        driver: currentUser.roleDiv === RoleDiv.CARRIAGE_COMPANY,
      },
      where: {
        serviceYmd: And(
          MoreThanOrEqual(serviceYmdFrom),
          LessThanOrEqual(serviceYmdTo),
        ),
      },
    });

    const manageCourseAbility =
      this.userAbilityFactory.defineManageCourse(currentUser);

    const validCourses = courses.filter(course => {
      return manageCourseAbility.can(AbilityAction.READ, course);
    });

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    await Promise.all(
      validCourses.map(course => {
        return Promise.all([
          this.downloadSignboardPhotoStream(
            archive,
            `${course.courseSeqNo}_1`,
            course.signboardPhoto1,
          ),
          this.downloadSignboardPhotoStream(
            archive,
            `${course.courseSeqNo}_2`,
            course.signboardPhoto2,
          ),
          this.downloadSignboardPhotoStream(
            archive,
            `${course.courseSeqNo}_3`,
            course.signboardPhoto3,
          ),
          this.downloadSignboardPhotoStream(
            archive,
            `${course.courseSeqNo}_4`,
            course.signboardPhoto4,
          ),
          this.downloadSignboardPhotoStream(
            archive,
            `${course.courseSeqNo}_5`,
            course.signboardPhoto5,
          ),
          this.downloadSignboardPhotoStream(
            archive,
            `${course.courseSeqNo}_6`,
            course.signboardPhoto6,
          ),
        ]);
      }),
    );

    return archive;
  }

  private async downloadSignboardPhotoStream(
    archive: Archiver,
    name: string,
    signBoardPhotoUrl?: string,
  ) {
    if (!signBoardPhotoUrl) return;

    const signBoardPhotoName =
      this.blobStorageService.getBlobNameFromUrl(signBoardPhotoUrl);
    const extension = path.extname(signBoardPhotoUrl);

    const downloadStream = await this.blobStorageService.downloadBlobStream(
      signBoardPhotoName,
    );

    archive.append(<Readable>downloadStream, { name: `${name}${extension}` });
  }
}

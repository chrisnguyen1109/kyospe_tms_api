import { BatchMngId } from '@app/common/types/common.type';
import { SlipStatusDiv, StatusDiv } from '@app/common/types/div.type';
import { MCourseTripRelationshipEntity } from '@app/database/entities/mCourseTripRelationship.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { TBatchMngRepository } from '@app/database/repositories/tBatchMng.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { TSpotRepository } from '@app/database/repositories/tSpot.repository';
import { TTripRepository } from '@app/database/repositories/tTrip.repository';
import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { And, LessThan, MoreThanOrEqual } from 'typeorm';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private readonly tBatchMngRepository: TBatchMngRepository,
    private readonly tSlipHeaderRepository: TSlipHeaderRepository,
    private readonly tTripRepository: TTripRepository,
    private readonly tSpotRepository: TSpotRepository,
  ) {}

  manualConfirmActualData() {
    return this.confirmActualData();
  }

  manualAssignCourse() {
    return this.assignCourse();
  }

  async confirmActualData() {
    this.logger.debug('Start confirming actual data');

    try {
      const batchMng = await this.tBatchMngRepository.softUpdateExecTime({
        batchMngId: BatchMngId.TRN_DLV004,
      });

      const lastExecTimeBefore30m = moment(batchMng.lastExecTime)
        .subtract(30, 'minutes')
        .toDate();
      const thisExecTimeBefore30m = moment(batchMng.thisExecTime)
        .subtract(30, 'minutes')
        .toDate();

      const slipHeaders = await this.tSlipHeaderRepository.findBy({
        updDatetime: And(
          MoreThanOrEqual(lastExecTimeBefore30m),
          LessThan(thisExecTimeBefore30m),
        ),
        fixedFlg: false,
        slipStatusDiv: SlipStatusDiv.FINISHED,
      });
      slipHeaders.forEach(slipHeader => (slipHeader.fixedFlg = true));

      const spots = await this.tSpotRepository.findBy({
        updDatetime: And(
          MoreThanOrEqual(lastExecTimeBefore30m),
          LessThan(thisExecTimeBefore30m),
        ),
        fixedFlg: false,
        statusDiv: StatusDiv.FINISHED,
      });
      spots.forEach(spot => (spot.fixedFlg = true));

      await Promise.all([
        this.tSlipHeaderRepository.save(slipHeaders),
        this.tSpotRepository.save(spots),
        this.tBatchMngRepository.save(batchMng),
      ]);

      this.logger.debug('Done confirming actual data');
      this.logger.debug(
        `TRN_DLV004_実績データ確定　伝票処理件数：${slipHeaders.length}件`,
      );
      this.logger.debug(
        `TRN_DLV004_実績データ確定　スポット処理件数：${spots.length}件`,
      );
    } catch (error) {
      this.logger.error('Failed to confirm actual data');
      console.dir(error);
    }
  }

  async assignCourse() {
    this.logger.debug('Start assign course');

    try {
      const batchMng = await this.tBatchMngRepository.softUpdateExecTime({
        batchMngId: BatchMngId.TRN_DLV001,
      });

      const trips = await this.tTripRepository
        .createQueryBuilder('tTrip')
        .leftJoin('tTrip.tSlipHeader', 'tSlipHeader')
        .innerJoin('tTrip.startBase', 'startBase')
        .innerJoin('tTrip.arriveBase', 'arriveBase')
        .innerJoin('tTrip.tSpots', 'tSpots')
        .innerJoin(
          MCourseTripRelationshipEntity,
          'courseTripRelationship',
          '((tTrip.startBaseId <> tSpots.baseId and CONCAT(COALESCE(startBase.address1, "") , COALESCE(startBase.address2, "")) like CONCAT( COALESCE(courseTripRelationship.startBaseAddress1, "")  , COALESCE(courseTripRelationship.startBaseAddress2, "") , "%")) OR (tTrip.startBaseId = tSpots.baseId and CONCAT( COALESCE(tSpots.address1, "") , COALESCE(tSpots.address2, "")) like CONCAT( COALESCE(courseTripRelationship.startBaseAddress1, "") , COALESCE(courseTripRelationship.startBaseAddress2, "") , "%"))) and ((tTrip.arriveBaseId <> tSpots.baseId and CONCAT(COALESCE(arriveBase.address1, "") , COALESCE(arriveBase.address2, "")) like CONCAT( COALESCE(courseTripRelationship.arriveBaseAddress1, "") , COALESCE(courseTripRelationship.arriveBaseAddress2, ""), "%")) OR (tTrip.arriveBaseId = tSpots.baseId and CONCAT(COALESCE(tSpots.address1, "") , COALESCE(tSpots.address2, "")) like CONCAT( COALESCE(courseTripRelationship.arriveBaseAddress1, "")  , COALESCE(courseTripRelationship.arriveBaseAddress2, ""), "%")))',
        )
        .innerJoinAndMapMany(
          'tTrip.courses',
          TCourseEntity,
          'tCourse',
          'tCourse.courseId = courseTripRelationship.courseId and tCourse.serviceYmd = tTrip.serviceYmd and tCourse.dispatchStatusDiv = "01" and tCourse.deliveryStatusDiv = "01"',
        )
        .where('tTrip.courseSeqNo IS NULL')
        .andWhere('tTrip.updDatetime > :lastExecTime', {
          lastExecTime: batchMng.lastExecTime,
        })
        .andWhere('tTrip.updDatetime <= :thisExecTime', {
          thisExecTime: batchMng.thisExecTime,
        })
        .andWhere('tSlipHeader.kadaiFlg = 0')
        .getMany();

      trips.forEach(
        (item: any) => (item.courseSeqNo = this.getMaxCourseSeq(item.courses)),
      );

      const relate_trips = await this.tTripRepository
        .createQueryBuilder('tTrip')
        .leftJoin('tTrip.tSlipHeader', 'tSlipHeader')
        .innerJoin(
          TTripEntity,
          'relateTrip',
          'relateTrip.serviceYmd = tTrip.serviceYmd and relateTrip.startBaseId = tTrip.startBaseId and relateTrip.arriveBaseId = tTrip.arriveBaseId and relateTrip.courseSeqNo is not null and relateTrip.deleteAt is null',
        )
        .innerJoinAndMapMany(
          'tTrip.courses',
          TCourseEntity,
          'tCourse',
          'tCourse.courseSeqNo = relateTrip.courseSeqNo and tCourse.serviceYmd = relateTrip.serviceYmd and tCourse.dispatchStatusDiv = "01" and tCourse.deliveryStatusDiv = "01" and tCourse.deleteAt is null',
        )
        .where('tTrip.courseSeqNo IS NULL')
        .andWhere('tTrip.updDatetime > :lastExecTime', {
          lastExecTime: batchMng.lastExecTime,
        })
        .andWhere('tTrip.updDatetime <= :thisExecTime', {
          thisExecTime: batchMng.thisExecTime,
        })
        .andWhere('tSlipHeader.kadaiFlg = 0')
        .andWhere('tSlipHeader.deliveryDiv = "02"')
        .getMany();

      relate_trips.filter(
        (item) => (trips.every((obj) => (obj.tripId != item.tripId))),
      ).forEach(
        (item: any) => (item.courseSeqNo = this.getMaxCourseSeq(item.courses)),
      );

      await Promise.all([
        this.tTripRepository.save(trips),
        this.tTripRepository.save(relate_trips),
        this.tBatchMngRepository.save(batchMng),
      ]);

      this.logger.debug('Done assign course');
    } catch (error) {
      this.logger.error('Fail assign course');
      console.dir(error);
    }
  }

  private getMaxCourseSeq(courses: TCourseEntity[]) {
    courses.sort((a, b) => b.courseSeqNo - a.courseSeqNo);
    return courses[0]?.courseSeqNo;
  }
}

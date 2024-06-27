import { BatchMngId } from '@app/common/types/common.type';
import {
  DeliveryStatusDiv,
  DispatchStatusDiv,
} from '@app/common/types/div.type';
import { MCourseEntity } from '@app/database/entities/mCourse.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { MCourseRepository } from '@app/database/repositories/mCourse.repository';
import { TBatchMngRepository } from '@app/database/repositories/tBatchMng.repository';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { TGpsActRepository } from '@app/database/repositories/tGpsAct.repository';
import { Injectable, Logger } from '@nestjs/common';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { LessThan, MoreThan } from 'typeorm';

const moment = extendMoment(<any>Moment);

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly tCourseRepository: TCourseRepository,
    private readonly tBatchMngRepository: TBatchMngRepository,
    private readonly mCourseRepository: MCourseRepository,
    private readonly tGpsActRepository: TGpsActRepository,
  ) {}

  manualAutoCreateCourse() {
    return this.autoCreateCourse();
  }

  manualUpdateCourseDeliveryStatus() {
    return this.updateCourseDeliveryStatus();
  }

  manualDeletePastGpsAct() {
    return this.deletePastGpsAct();
  }

  async autoCreateCourse() {
    this.logger.debug('Start creating course');

    try {
      const batchMng = await this.tBatchMngRepository.softUpdateExecTime({
        batchMngId: BatchMngId.TRN_CRS001,
      });

      const newMasterCourses = await this.mCourseRepository.findBy({
        regiDatetime: MoreThan(batchMng.lastExecTime),
        charterFlg: false,
      });

      const range = moment.rangeFromInterval('day', 30);
      const newCourses: TCourseEntity[] = [];

      for (const mCourse of newMasterCourses) {
        for (const day of range.by('day')) {
          const course = this.createCourseByMCourse(
            mCourse,
            day.format('YYYY/MM/DD'),
          );

          newCourses.push(course);
        }
      }

      const masterCourses = await this.mCourseRepository.findBy({
        charterFlg: false,
      });

      for (const mCourse of masterCourses) {
        const serviceYmd = moment().add(31, 'day').format('YYYY/MM/DD');

        const existCourse = await this.tCourseRepository.findOneBy({
          courseId: mCourse.courseId,
          serviceYmd,
        });
        if (existCourse) continue;

        const course = this.createCourseByMCourse(mCourse, serviceYmd);

        newCourses.push(course);
      }

      await Promise.all([
        this.tCourseRepository.save(newCourses),
        this.tBatchMngRepository.save(batchMng),
      ]);

      this.logger.debug('Done creating course');
    } catch (error) {
      this.logger.error('Failed to create course');
      console.dir(error);
    }
  }

  async updateCourseDeliveryStatus() {
    this.logger.debug('Start updating course delivery status');

    try {
      const yesterday = moment().subtract(1, 'day').format('YYYY/MM/DD');

      const courses = await this.tCourseRepository
        .createQueryBuilder('tCourse')
        .leftJoin('tCourse.tTrips', 'tTrip')
        .where('tCourse.serviceYmd = :yesterday', { yesterday })
        .andWhere('tTrip.tripId IS NULL')
        .getMany();

      courses.forEach(
        course => (course.deliveryStatusDiv = DeliveryStatusDiv.FINISHED),
      );

      await this.tCourseRepository.save(courses);

      this.logger.debug('Done updating course delivery status');
    } catch (error) {
      this.logger.error('Failed to update course delivery status');
      console.dir(error);
    }
  }

  async deletePastGpsAct() {
    this.logger.debug('Start deleting past gps act');

    try {
      const past8Day = moment().subtract(8, 'days').toDate();

      const pastGpsActs = await this.tGpsActRepository.findBy({
        updDatetime: LessThan(past8Day),
      });

      await this.tGpsActRepository.remove(pastGpsActs);

      this.logger.debug('Done deleting past gps act');
    } catch (error) {
      this.logger.error('Failed to delete past gps act');
      console.dir(error);
    }
  }

  private createCourseByMCourse(mCourse: MCourseEntity, serviceYmd: string) {
    return this.tCourseRepository.create({
      courseId: mCourse.courseId,
      serviceYmd,
      dispatchStatusDiv: DispatchStatusDiv.UNCONFIRMED,
      deliveryStatusDiv: DeliveryStatusDiv.UNFINISHED,
      startTime: mCourse.serviceStartTime,
      endTime: mCourse.serviceEndTime,
      startBaseId: mCourse.startBaseId,
      arriveBaseId: mCourse.arriveBaseId,
      transportCompanyId: mCourse.transportCompanyId,
    });
  }
}

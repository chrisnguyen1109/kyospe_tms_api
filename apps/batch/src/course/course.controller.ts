import { AppEventPattern } from '@app/common/types/common.type';
import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { CourseService } from './course.service';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @EventPattern(AppEventPattern.Batch.AUTO_CREATE_COURSE)
  autoCreateCourse() {
    return this.courseService.manualAutoCreateCourse();
  }

  @EventPattern(AppEventPattern.Batch.UPDATE_COURSE_DELIVERY_STATUS)
  updateCourseDeliveryStatus() {
    return this.courseService.manualUpdateCourseDeliveryStatus();
  }

  @EventPattern(AppEventPattern.Batch.DELETE_PAST_GPS_ACT)
  deletePastGpsAct() {
    return this.courseService.manualUpdateCourseDeliveryStatus();
  }
}

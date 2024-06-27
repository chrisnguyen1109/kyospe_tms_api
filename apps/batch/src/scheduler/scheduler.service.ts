import { AppConfigService } from '@app/app-config/appConfig.service';
import { AuthService } from '@batch/auth/auth.service';
import { CourseService } from '@batch/course/course.service';
import { DeliveryService } from '@batch/delivery/delivery.service';
import { IfService } from '@batch/if/if.service';
import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly ifService: IfService,
    private readonly deliveryService: DeliveryService,
    private readonly courseService: CourseService,
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.startCronJob(
      () => this.ifService.importIfSlip(),
      this.appConfigService.cronTimeConfig.connectSlipCronTime,
    );

    this.startCronJob(
      () => this.ifService.importIfMBase(),
      this.appConfigService.cronTimeConfig.connectMasterCronTime,
    );

    this.startCronJob(
      () => this.ifService.exportIfSign(),
      this.appConfigService.cronTimeConfig.connectSignCronTime,
    );

    this.startCronJob(() => {
      this.courseService.autoCreateCourse();
      this.courseService.updateCourseDeliveryStatus();
      this.courseService.deletePastGpsAct();
    }, this.appConfigService.cronTimeConfig.autoCreatCourseCronTime);

    this.startCronJob(
      () => this.deliveryService.confirmActualData(),
      this.appConfigService.cronTimeConfig.confirmActualDataCronTime,
    );

    this.startCronJob(
      () => this.authService.removeSession(),
      this.appConfigService.cronTimeConfig.removeSessionCronTime,
    );
  }

  private startCronJob(onJob: () => void, cronTime?: string) {
    if (cronTime) {
      new CronJob(cronTime, onJob, null, true, 'Asia/Tokyo');
    }
  }
}

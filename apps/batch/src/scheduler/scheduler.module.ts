import { CourseModule } from '@batch/course/course.module';
import { DeliveryModule } from '@batch/delivery/delivery.module';
import { IfModule } from '@batch/if/if.module';
import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { AuthModule } from '@batch/auth/auth.module';

@Module({
  imports: [IfModule, DeliveryModule, CourseModule, AuthModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}

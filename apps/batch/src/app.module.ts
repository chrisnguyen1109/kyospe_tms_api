import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CourseModule } from './course/course.module';
import { DeliveryModule } from './delivery/delivery.module';
import { IfModule } from './if/if.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    SharedModule,
    IfModule,
    DeliveryModule,
    SchedulerModule,
    CourseModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

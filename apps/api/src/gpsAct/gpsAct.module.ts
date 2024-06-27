import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { TGpsActEntity } from '@app/database/entities/tGpsAct.entity';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { TGpsActRepository } from '@app/database/repositories/tGpsAct.repository';
import { TGpsActSubscriber } from '@app/database/subscribers/tGpsAct.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpsActController } from './gpsAct.controller';
import { GpsActService } from './gpsAct.service';

@Module({
  imports: [TypeOrmModule.forFeature([TGpsActEntity, TCourseEntity])],
  controllers: [GpsActController],
  providers: [
    GpsActService,
    TGpsActRepository,
    TCourseRepository,
    TGpsActSubscriber,
  ],
})
export class GpsActModule {}

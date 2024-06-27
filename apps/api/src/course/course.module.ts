import { AuthModule } from '@api/auth/auth.module';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MCourseEntity } from '@app/database/entities/mCourse.entity';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { THighwayFeeEntity } from '@app/database/entities/tHighwayFee.entity';
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
import { TCourseSubscriber } from '@app/database/subscribers/tCourse.subscriber';
import { TSpotSubscriber } from '@app/database/subscribers/tSpot.subscriber';
import { TTripSubscriber } from '@app/database/subscribers/tTrip.subscriber';
import { AssignSpotsTransaction } from '@app/database/transactions/assignSpots.transaction';
import { UnassignSpotsTransaction } from '@app/database/transactions/unassignSpots.transaction';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TCourseEntity,
      TTripEntity,
      TSpotEntity,
      MCourseEntity,
      MCarEntity,
      MDriverEntity,
      MUserEntity,
      THighwayFeeEntity,
      MBaseEntity,
    ]),
    AuthModule,
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    TCourseRepository,
    TTripRepository,
    TSpotRepository,
    MCourseRepository,
    TCourseSubscriber,
    MCarRepository,
    MDriverRepository,
    MUserRepository,
    THighwayFeeRepository,
    MBaseRepository,
    AssignSpotsTransaction,
    TSpotSubscriber,
    TTripSubscriber,
    UnassignSpotsTransaction,
  ],
})
export class CourseModule {}

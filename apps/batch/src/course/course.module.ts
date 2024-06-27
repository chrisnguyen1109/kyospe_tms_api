import { MCourseEntity } from '@app/database/entities/mCourse.entity';
import { TBatchMngEntity } from '@app/database/entities/tBatchMng.entity';
import { TCourseEntity } from '@app/database/entities/tCourse.entity';
import { TGpsActEntity } from '@app/database/entities/tGpsAct.entity';
import { MCourseRepository } from '@app/database/repositories/mCourse.repository';
import { TBatchMngRepository } from '@app/database/repositories/tBatchMng.repository';
import { TCourseRepository } from '@app/database/repositories/tCourse.repository';
import { TGpsActRepository } from '@app/database/repositories/tGpsAct.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TCourseEntity,
      TBatchMngEntity,
      MCourseEntity,
      TGpsActEntity,
    ]),
  ],
  controllers: [CourseController],
  providers: [
    CourseService,
    TCourseRepository,
    TBatchMngRepository,
    MCourseRepository,
    TGpsActRepository,
  ],
  exports: [CourseService],
})
export class CourseModule {}

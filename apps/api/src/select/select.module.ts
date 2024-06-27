import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SelectController } from './select.controller';
import { SelectService } from './select.service';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MCourseEntity } from '@app/database/entities/mCourse.entity';
import { MCourseRepository } from '@app/database/repositories/mCourse.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MBaseEntity,
      MTransportCompanyEntity,
      MDriverEntity,
      MCarEntity,
      MCourseEntity,
    ]),
  ],
  controllers: [SelectController],
  providers: [
    SelectService,
    MBaseRepository,
    MTransportCompanyRepository,
    MDriverRepository,
    MCarRepository,
    MCourseRepository,
  ],
})
export class SelectModule {}

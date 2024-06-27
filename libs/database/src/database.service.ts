import { AppConfigService } from '@app/app-config/appConfig.service';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseNamingStrategy } from './database.naming-strategy';
import { MBaseEntity } from './entities/mBase.entity';
import { MCarEntity } from './entities/mCar.entity';
import { MCngTransportCompanyEntity } from './entities/mCngTransportCompany.entity';
import { MCourseEntity } from './entities/mCourse.entity';
import { MCourseTripRelationshipEntity } from './entities/mCourseTripRelationship.entity';
import { MDivEntity } from './entities/mDiv.entity';
import { MDivValueEntity } from './entities/mDivValue.entity';
import { MDriverEntity } from './entities/mDriver.entity';
import { MTransportCompanyEntity } from './entities/mTransportCompany.entity';
import { MUserEntity } from './entities/mUser.entity';
import { SessionEntity } from './entities/session.entity';
import { TBatchMngEntity } from './entities/tBatchMng.entity';
import { TCourseEntity } from './entities/tCourse.entity';
import { TGpsActEntity } from './entities/tGpsAct.entity';
import { THighwayFeeEntity } from './entities/tHighwayFee.entity';
import { THighwayFeeReceiptImageEntity } from './entities/tHighwayFeeReceiptImage.entity';
import { TSlipDeadlineEntity } from './entities/tSlipDeadline.entity';
import { TSlipDetailEntity } from './entities/tSlipDetail.entity';
import { TSlipHeaderEntity } from './entities/tSlipHeader.entity';
import { TSpotEntity } from './entities/tSpot.entity';
import { TTripEntity } from './entities/tTrip.entity';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.appConfigService.typeOrmConfig,
      entities: [
        MBaseEntity,
        MTransportCompanyEntity,
        MUserEntity,
        MDriverEntity,
        MCarEntity,
        MDivEntity,
        MDivValueEntity,
        SessionEntity,
        MCourseEntity,
        TCourseEntity,
        THighwayFeeEntity,
        THighwayFeeReceiptImageEntity,
        TTripEntity,
        TSpotEntity,
        TSlipHeaderEntity,
        TSlipDetailEntity,
        TSlipDeadlineEntity,
        MCourseTripRelationshipEntity,
        TBatchMngEntity,
        MCngTransportCompanyEntity,
        TGpsActEntity,
      ],
      namingStrategy: DatabaseNamingStrategy.getInstance(),
    };
  }
}

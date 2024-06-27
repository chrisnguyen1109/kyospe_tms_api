import { AuthModule } from '@api/auth/auth.module';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { MTransportCompanySubscriber } from '@app/database/subscribers/mTransportCompany.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransportCompanyController } from './transportCompany.controller';
import { TransportCompanyService } from './transportCompany.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MTransportCompanyEntity,
      MBaseEntity,
      MDriverEntity,
      MCarEntity,
      MUserEntity,
    ]),
    AuthModule,
  ],
  controllers: [TransportCompanyController],
  providers: [
    TransportCompanyService,
    MTransportCompanyRepository,
    MBaseRepository,
    MTransportCompanySubscriber,
    MDriverRepository,
    MCarRepository,
    MUserRepository,
  ],
})
export class TransportCompanyModule {}

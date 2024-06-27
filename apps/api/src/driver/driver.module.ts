import { AuthModule } from '@api/auth/auth.module';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MDriverEntity } from '@app/database/entities/mDriver.entity';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MDriverRepository } from '@app/database/repositories/mDriver.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MDriverSubscriber } from '@app/database/subscribers/mDriver.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MDriverEntity,
      MTransportCompanyEntity,
      MCarEntity,
    ]),
    AuthModule,
  ],
  controllers: [DriverController],
  providers: [
    DriverService,
    MDriverRepository,
    MTransportCompanyRepository,
    MDriverSubscriber,
    MCarRepository,
  ],
})
export class DriverModule {}

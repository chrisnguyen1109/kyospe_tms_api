import { AuthModule } from '@api/auth/auth.module';
import { MCarEntity } from '@app/database/entities/mCar.entity';
import { MTransportCompanyEntity } from '@app/database/entities/mTransportCompany.entity';
import { MCarRepository } from '@app/database/repositories/mCar.repository';
import { MTransportCompanyRepository } from '@app/database/repositories/mTransportCompany.repository';
import { MCarSubscriber } from '@app/database/subscribers/mCar.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarController } from './car.controller';
import { CarService } from './car.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MCarEntity, MTransportCompanyEntity]),
    AuthModule,
  ],
  controllers: [CarController],
  providers: [
    CarService,
    MCarRepository,
    MTransportCompanyRepository,
    MCarSubscriber,
  ],
})
export class CarModule {}

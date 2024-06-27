import { TBatchMngEntity } from '@app/database/entities/tBatchMng.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import { TTripEntity } from '@app/database/entities/tTrip.entity';
import { TBatchMngRepository } from '@app/database/repositories/tBatchMng.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { TSpotRepository } from '@app/database/repositories/tSpot.repository';
import { TTripRepository } from '@app/database/repositories/tTrip.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TBatchMngEntity,
      TSlipHeaderEntity,
      TTripEntity,
      TSpotEntity,
    ]),
  ],
  controllers: [DeliveryController],
  providers: [
    DeliveryService,
    TBatchMngRepository,
    TSlipHeaderRepository,
    TTripRepository,
    TSpotRepository,
  ],
  exports: [DeliveryService],
})
export class DeliveryModule {}

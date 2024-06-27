import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { TBatchMngEntity } from '@app/database/entities/tBatchMng.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { TBatchMngRepository } from '@app/database/repositories/tBatchMng.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { ImportMBaseTransaction } from '@app/database/transactions/importMBase.transaction';
import { ImportSlipTransaction } from '@app/database/transactions/importSlip.transaction';
import { DeliveryModule } from '@batch/delivery/delivery.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IfController } from './if.controller';
import { IfService } from './if.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MBaseEntity, TBatchMngEntity, TSlipHeaderEntity]),
    DeliveryModule,
  ],
  controllers: [IfController],
  providers: [
    IfService,
    ImportMBaseTransaction,
    MBaseRepository,
    ImportSlipTransaction,
    TBatchMngRepository,
    TSlipHeaderRepository,
  ],
  exports: [IfService],
})
export class IfModule {}

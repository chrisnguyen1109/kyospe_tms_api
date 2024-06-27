import { AuthModule } from '@api/auth/auth.module';
import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { TSpotEntity } from '@app/database/entities/tSpot.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { TSpotRepository } from '@app/database/repositories/tSpot.repository';
import { MBaseSubscriber } from '@app/database/subscribers/mBase.subscriber';
import { TSlipHeaderSubscriber } from '@app/database/subscribers/tSlipHeader.subscriber';
import { TSpotSubscriber } from '@app/database/subscribers/tSpot.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpotController } from './spot.controller';
import { SpotService } from './spot.service';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { MUserEntity } from '@app/database/entities/mUser.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TSpotEntity,
      TSlipHeaderEntity,
      MBaseEntity,
      MUserEntity,
    ]),
    AuthModule,
  ],
  controllers: [SpotController],
  providers: [
    SpotService,
    TSpotRepository,
    TSpotSubscriber,
    TSlipHeaderSubscriber,
    TSlipHeaderRepository,
    MBaseRepository,
    MBaseSubscriber,
    MUserRepository,
  ],
})
export class SpotModule {}

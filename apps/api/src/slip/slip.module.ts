import { AuthModule } from '@api/auth/auth.module';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import { TSlipHeaderEntity } from '@app/database/entities/tSlipHeader.entity';
import { MUserRepository } from '@app/database/repositories/mUser.repository';
import { TSlipHeaderRepository } from '@app/database/repositories/tSlipHeader.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlipController } from './slip.controller';
import { SlipService } from './slip.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TSlipHeaderEntity, MUserEntity]),
    AuthModule,
  ],
  controllers: [SlipController],
  providers: [SlipService, TSlipHeaderRepository, MUserRepository],
})
export class SlipModule {}

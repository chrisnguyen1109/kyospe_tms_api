import { MBaseEntity } from '@app/database/entities/mBase.entity';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { MBaseSubscriber } from '@app/database/subscribers/mBase.subscriber';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';

@Module({
  imports: [TypeOrmModule.forFeature([MBaseEntity])],
  controllers: [BaseController],
  providers: [BaseService, MBaseRepository, MBaseSubscriber],
})
export class BaseModule {}

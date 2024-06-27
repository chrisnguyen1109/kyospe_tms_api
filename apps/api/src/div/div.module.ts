import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivController } from './div.controller';
import { MDivValueEntity } from '@app/database/entities/mDivValue.entity';
import { MDivValueRepository } from '@app/database/repositories/mDivValue.repository';
import { DivService } from './div.service';

@Module({
  imports: [TypeOrmModule.forFeature([MDivValueEntity])],
  controllers: [DivController],
  providers: [DivService, MDivValueRepository],
})
export class DivModule {}

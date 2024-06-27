import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { THighwayFeeReceiptImageEntity } from '../entities/tHighwayFeeReceiptImage.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class THighwayFeeReceiptImageRepository extends BaseRepository<THighwayFeeReceiptImageEntity> {
  constructor(
    @InjectRepository(THighwayFeeReceiptImageEntity)
    private readonly tHighwayFeeReceiptImageRepository: Repository<THighwayFeeReceiptImageEntity>,
  ) {
    super(tHighwayFeeReceiptImageRepository);
  }
}

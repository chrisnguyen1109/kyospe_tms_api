import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { THighwayFeeEntity } from '../entities/tHighwayFee.entity';
import { BaseRepository } from './base.repository';

export class THighwayFeeRepository extends BaseRepository<THighwayFeeEntity> {
  constructor(
    @InjectRepository(THighwayFeeEntity)
    private readonly tHighwayFeeRepository: Repository<THighwayFeeEntity>,
  ) {
    super(tHighwayFeeRepository);
  }
}

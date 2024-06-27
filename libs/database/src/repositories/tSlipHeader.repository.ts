import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSlipHeaderEntity } from '../entities/tSlipHeader.entity';
import { BaseRepository } from './base.repository';

export class TSlipHeaderRepository extends BaseRepository<TSlipHeaderEntity> {
  constructor(
    @InjectRepository(TSlipHeaderEntity)
    private readonly tSlipHeaderRepository: Repository<TSlipHeaderEntity>,
  ) {
    super(tSlipHeaderRepository);
  }
}

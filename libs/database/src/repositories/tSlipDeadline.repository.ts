import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSlipDeadlineEntity } from '../entities/tSlipDeadline.entity';
import { BaseRepository } from './base.repository';

export class TSlipDeadlineRepository extends BaseRepository<TSlipDeadlineEntity> {
  constructor(
    @InjectRepository(TSlipDeadlineEntity)
    private readonly tSlipDeadlineRepository: Repository<TSlipDeadlineEntity>,
  ) {
    super(tSlipDeadlineRepository);
  }
}

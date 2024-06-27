import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MDivValueEntity } from '../entities/mDivValue.entity';
import { BaseRepository } from './base.repository';

export class MDivValueRepository extends BaseRepository<MDivValueEntity> {
  constructor(
    @InjectRepository(MDivValueEntity)
    private readonly mDivValueRepository: Repository<MDivValueEntity>,
  ) {
    super(mDivValueRepository);
  }
}

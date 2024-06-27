import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MBaseEntity } from '../entities/mBase.entity';
import { BaseRepository } from './base.repository';

export class MBaseRepository extends BaseRepository<MBaseEntity> {
  constructor(
    @InjectRepository(MBaseEntity)
    private readonly mBaseRepository: Repository<MBaseEntity>,
  ) {
    super(mBaseRepository);
  }
}

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TGpsActEntity } from '../entities/tGpsAct.entity';

export class TGpsActRepository extends BaseRepository<TGpsActEntity> {
  constructor(
    @InjectRepository(TGpsActEntity)
    private readonly tGpsActRepository: Repository<TGpsActEntity>,
  ) {
    super(tGpsActRepository);
  }
}

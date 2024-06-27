import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MCarEntity } from '../entities/mCar.entity';
import { BaseRepository } from './base.repository';

export class MCarRepository extends BaseRepository<MCarEntity> {
  constructor(
    @InjectRepository(MCarEntity)
    private readonly mCarRepository: Repository<MCarEntity>,
  ) {
    super(mCarRepository);
  }
}

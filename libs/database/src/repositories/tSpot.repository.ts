import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TSpotEntity } from '../entities/tSpot.entity';
import { BaseRepository } from './base.repository';

export class TSpotRepository extends BaseRepository<TSpotEntity> {
  constructor(
    @InjectRepository(TSpotEntity)
    private readonly tSpotRepository: Repository<TSpotEntity>,
  ) {
    super(tSpotRepository);
  }
}

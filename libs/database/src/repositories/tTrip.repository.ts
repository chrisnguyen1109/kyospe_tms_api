import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TTripEntity } from '../entities/tTrip.entity';
import { BaseRepository } from './base.repository';

export class TTripRepository extends BaseRepository<TTripEntity> {
  constructor(
    @InjectRepository(TTripEntity)
    private readonly tTripRepository: Repository<TTripEntity>,
  ) {
    super(tTripRepository);
  }
}

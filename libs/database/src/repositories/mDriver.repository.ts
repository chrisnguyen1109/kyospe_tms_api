import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MDriverEntity } from '../entities/mDriver.entity';
import { BaseRepository } from './base.repository';

export class MDriverRepository extends BaseRepository<MDriverEntity> {
  constructor(
    @InjectRepository(MDriverEntity)
    private readonly mDriverRepository: Repository<MDriverEntity>,
  ) {
    super(mDriverRepository);
  }

  async getDriversInCompanies(
    transportCompanyIds: number[],
  ): Promise<MDriverEntity[]> {
    return this.mDriverRepository.find({
      select: ['driverId', 'driverNm', 'carId'],
      where: {
        transportCompanyId: In(transportCompanyIds),
      },
    });
  }
}

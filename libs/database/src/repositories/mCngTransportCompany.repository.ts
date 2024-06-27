import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MCngTransportCompanyEntity } from '../entities/mCngTransportCompany.entity';
import { BaseRepository } from './base.repository';

export class MCngTransportCompanyRepository extends BaseRepository<MCngTransportCompanyEntity> {
  constructor(
    @InjectRepository(MCngTransportCompanyEntity)
    private readonly mCngTransportCompanyRepository: Repository<MCngTransportCompanyEntity>,
  ) {
    super(mCngTransportCompanyRepository);
  }
}

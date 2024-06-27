import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { MTransportCompanyEntity } from '../entities/mTransportCompany.entity';
import { BaseRepository } from './base.repository';

export class MTransportCompanyRepository extends BaseRepository<MTransportCompanyEntity> {
  constructor(
    @InjectRepository(MTransportCompanyEntity)
    private readonly mTransportCompanyRepository: Repository<MTransportCompanyEntity>,
  ) {
    super(mTransportCompanyRepository);
  }

  async getChildrenTransportCompanyIds(transportCompanyId: number) {
    const childrenTransportCompany =
      await this.mTransportCompanyRepository.find({
        select: {
          transportCompanyId: true,
        },
        where: {
          parentCompanyId: transportCompanyId,
        },
      });

    return childrenTransportCompany.map(item => item.transportCompanyId);
  }

  async getSameTransportCompanyIds(transportCompanyId: number) {
    const transportCompanies = await this.mTransportCompanyRepository.find({
      select: ['transportCompanyId'],
      where: [
        { transportCompanyId: transportCompanyId },
        { parentCompanyId: transportCompanyId },
      ],
    });

    return transportCompanies.map(item => item.transportCompanyId);
  }

  async getParentTransportCompanyIds() {
    const transportCompanies = await this.mTransportCompanyRepository.find({
      select: ['transportCompanyId'],
      where: { parentCompanyId: IsNull() },
    });

    return transportCompanies.map(item => item.transportCompanyId);
  }
}

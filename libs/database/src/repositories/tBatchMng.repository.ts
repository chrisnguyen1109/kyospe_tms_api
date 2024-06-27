import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { TBatchMngEntity } from '../entities/tBatchMng.entity';
import { FindOneByParams } from '@app/common/types/util.type';

export class TBatchMngRepository extends BaseRepository<TBatchMngEntity> {
  constructor(
    @InjectRepository(TBatchMngEntity)
    private readonly tBatchMngRepository: Repository<TBatchMngEntity>,
  ) {
    super(tBatchMngRepository);
  }

  async softUpdateExecTime(where: FindOneByParams<TBatchMngEntity>) {
    const batchMng = await this.tBatchMngRepository.findOneByOrFail(where);

    batchMng.lastExecTime = batchMng.thisExecTime ?? 0;
    batchMng.thisExecTime = new Date();

    return batchMng;
  }
}

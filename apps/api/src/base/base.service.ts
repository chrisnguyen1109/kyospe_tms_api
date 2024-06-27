import { TRN_REQ005_001Exception } from '@app/common/filters/exceptions/TRN_REQ005_001.exception';
import { MBaseRepository } from '@app/database/repositories/mBase.repository';
import { Injectable } from '@nestjs/common';
import { UpdateBaseMemoBodyDto } from './dtos/updateBaseMemoBody.dto';

@Injectable()
export class BaseService {
  constructor(private readonly mBaseRepository: MBaseRepository) {}

  async updateBaseMemo(baseId: number, body: UpdateBaseMemoBodyDto) {
    const existBase = await this.mBaseRepository.findOneByOrThrow(
      { baseId },
      TRN_REQ005_001Exception,
      `base not found with baseId: ${baseId}`,
    );

    existBase.baseMemo = body.baseMemo;

    return this.mBaseRepository.save(existBase);
  }
}

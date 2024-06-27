import { ClassConstructor, FindOneByParams } from '@app/common/types/util.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MUserEntity } from '../entities/mUser.entity';
import { BaseRepository } from './base.repository';

export class MUserRepository extends BaseRepository<MUserEntity> {
  constructor(
    @InjectRepository(MUserEntity)
    private readonly mUserRepository: Repository<MUserEntity>,
  ) {
    super(mUserRepository);
  }

  async findExistAndThrow(
    where: FindOneByParams<MUserEntity>,
    ErrorException: ClassConstructor,
    errorMsg: string = 'user already exists',
  ) {
    const existUser = await this.mUserRepository.findOneBy(where);
    if (existUser) {
      throw new ErrorException(errorMsg);
    }
  }

  async getUserParentCompanyId(mUserId: number) {
    const user = await this.mUserRepository.findOneOrFail({
      relations: {
        transportCompany: true,
      },
      where: {
        mUserId,
      },
    });

    return user.parentCompanyId;
  }
}

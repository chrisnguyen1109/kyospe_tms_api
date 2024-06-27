import { ClassConstructor, FindOneByParams } from '@app/common/types/util.type';
import { FindOneOptions, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<E extends ObjectLiteral> extends Repository<E> {
  constructor(private readonly repository: Repository<E>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  findOneOrThrow(
    options: FindOneOptions<E>,
    ErrorException?: ClassConstructor,
    message: string = 'entity not found',
  ) {
    return this.repository.findOneOrFail(options).catch(err => {
      if (ErrorException) {
        throw new ErrorException(message);
      }

      throw err;
    });
  }

  findOneByOrThrow(
    where: FindOneByParams<E>,
    ErrorException?: ClassConstructor,
    message: string = 'entity not found',
  ) {
    return this.repository.findOneByOrFail(where).catch(err => {
      if (ErrorException) {
        throw new ErrorException(message);
      }

      throw err;
    });
  }
}

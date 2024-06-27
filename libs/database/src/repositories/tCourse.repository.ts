import { ClassConstructor, FindOneByParams } from '@app/common/types/util.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TCourseEntity } from '../entities/tCourse.entity';
import { BaseRepository } from './base.repository';

export class TCourseRepository extends BaseRepository<TCourseEntity> {
  constructor(
    @InjectRepository(TCourseEntity)
    private readonly tCourseRepository: Repository<TCourseEntity>,
  ) {
    super(tCourseRepository);
  }

  async findExistAndThrow(
    where: FindOneByParams<TCourseEntity>,
    ErrorException: ClassConstructor,
    errorMsg: string = 'course already exists',
  ) {
    const existCourse = await this.tCourseRepository.findOneBy(where);
    if (existCourse) {
      throw new ErrorException(errorMsg);
    }
  }
}

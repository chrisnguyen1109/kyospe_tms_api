import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MCourseEntity } from '../entities/mCourse.entity';
import { BaseRepository } from './base.repository';

export class MCourseRepository extends BaseRepository<MCourseEntity> {
  constructor(
    @InjectRepository(MCourseEntity)
    private readonly mCourseRepository: Repository<MCourseEntity>,
  ) {
    super(mCourseRepository);
  }
}

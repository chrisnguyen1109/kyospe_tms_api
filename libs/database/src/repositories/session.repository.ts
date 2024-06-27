import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../entities/session.entity';
import { BaseRepository } from './base.repository';

export class SessionRepository extends BaseRepository<SessionEntity> {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {
    super(sessionRepository);
  }

  buildSession(props: DeepPartial<SessionEntity>) {
    const session = this.sessionRepository.create(props);

    return this.sessionRepository.save(session);
  }
}

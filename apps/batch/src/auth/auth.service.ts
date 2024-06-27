import { SessionRepository } from '@app/database/repositories/session.repository';
import { Injectable, Logger } from '@nestjs/common';
import { IsNull, LessThan } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly sessionRepository: SessionRepository) {}

  async manualRemoveSession() {
    return this.removeSession();
  }

  async removeSession() {
    this.logger.debug('Start removing session');

    try {
      const records = await this.sessionRepository.find({
        where: [{ expireTime: IsNull() }, { expireTime: LessThan(new Date()) }],
      });

      await this.sessionRepository.remove(records);

      this.logger.debug('Done removing session');
    } catch (error) {
      this.logger.error('Failed to remove session');
      console.dir(error);
    }
  }
}

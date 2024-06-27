import { AppConfigService } from '@app/app-config/appConfig.service';
import moment from 'moment';
import ms from 'ms';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { SessionEntity } from '../entities/session.entity';

@EventSubscriber()
export class SessionSubscriber
  implements EntitySubscriberInterface<SessionEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly appConfigService: AppConfigService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return SessionEntity;
  }

  async beforeInsert(event: InsertEvent<SessionEntity>) {
    event.entity.expireTime = this.getExpireTime();
  }

  async beforeUpdate(event: UpdateEvent<SessionEntity>) {
    const sessionEntity = <SessionEntity>event.entity;

    sessionEntity.expireTime = this.getExpireTime();
  }

  private getExpireTime() {
    const rtExpire = this.appConfigService.authConfig.rtExpire;

    return moment().add(ms(rtExpire), 'milliseconds').toDate();
  }
}

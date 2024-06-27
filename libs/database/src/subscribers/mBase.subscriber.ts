import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { MBaseEntity } from '../entities/mBase.entity';

@EventSubscriber()
export class MBaseSubscriber implements EntitySubscriberInterface<MBaseEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return MBaseEntity;
  }

  async beforeInsert(event: InsertEvent<MBaseEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<MBaseEntity>) {
    const mBaseEntity = <MBaseEntity>event.entity;

    mBaseEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    mBaseEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

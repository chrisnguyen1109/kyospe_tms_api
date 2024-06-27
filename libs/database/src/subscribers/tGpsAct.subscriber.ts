import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { TGpsActEntity } from '../entities/tGpsAct.entity';

@EventSubscriber()
export class TGpsActSubscriber
  implements EntitySubscriberInterface<TGpsActEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return TGpsActEntity;
  }

  async beforeInsert(event: InsertEvent<TGpsActEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<TGpsActEntity>) {
    const tGpsActEntity = <TGpsActEntity>event.entity;

    tGpsActEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    tGpsActEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

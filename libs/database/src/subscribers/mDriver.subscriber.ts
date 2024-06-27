import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { MDriverEntity } from '../entities/mDriver.entity';

@EventSubscriber()
export class MDriverSubscriber
  implements EntitySubscriberInterface<MDriverEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return MDriverEntity;
  }

  async beforeInsert(event: InsertEvent<MDriverEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<MDriverEntity>) {
    const mDriverEntity = <MDriverEntity>event.entity;

    mDriverEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    mDriverEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

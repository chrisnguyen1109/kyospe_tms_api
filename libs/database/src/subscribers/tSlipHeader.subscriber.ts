import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { TSlipHeaderEntity } from '../entities/tSlipHeader.entity';

@EventSubscriber()
export class TSlipHeaderSubscriber
  implements EntitySubscriberInterface<TSlipHeaderEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return TSlipHeaderEntity;
  }

  async beforeInsert(event: InsertEvent<TSlipHeaderEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<TSlipHeaderEntity>) {
    const tSlipHeaderEntity = <TSlipHeaderEntity>event.entity;

    tSlipHeaderEntity.updUserId =
      this.clsService.get('user')?.mUserId ?? undefined;
    tSlipHeaderEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

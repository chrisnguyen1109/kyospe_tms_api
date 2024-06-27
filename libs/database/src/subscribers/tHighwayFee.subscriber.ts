import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { THighwayFeeEntity } from '../entities/tHighwayFee.entity';

@EventSubscriber()
export class THighwayFeeSubscriber
  implements EntitySubscriberInterface<THighwayFeeEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return THighwayFeeEntity;
  }

  async beforeInsert(event: InsertEvent<THighwayFeeEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<THighwayFeeEntity>) {
    const tHighwayFeeEntity = <THighwayFeeEntity>event.entity;

    tHighwayFeeEntity.updUserId =
      this.clsService.get('user')?.mUserId ?? undefined;
    tHighwayFeeEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

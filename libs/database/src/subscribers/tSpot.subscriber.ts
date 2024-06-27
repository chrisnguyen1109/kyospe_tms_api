import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { TSpotEntity } from '../entities/tSpot.entity';

@EventSubscriber()
export class TSpotSubscriber implements EntitySubscriberInterface<TSpotEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return TSpotEntity;
  }

  async beforeInsert(event: InsertEvent<TSpotEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<TSpotEntity>) {
    const tSpotEntity = <TSpotEntity>event.entity;

    tSpotEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    tSpotEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

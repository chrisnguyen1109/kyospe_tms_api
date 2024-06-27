import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { TTripEntity } from '../entities/tTrip.entity';

@EventSubscriber()
export class TTripSubscriber implements EntitySubscriberInterface<TTripEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return TTripEntity;
  }

  async beforeInsert(event: InsertEvent<TTripEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<TTripEntity>) {
    const tTripEntity = <TTripEntity>event.entity;

    tTripEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    tTripEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

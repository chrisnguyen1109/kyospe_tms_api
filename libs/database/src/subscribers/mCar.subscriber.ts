import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { MCarEntity } from '../entities/mCar.entity';

@EventSubscriber()
export class MCarSubscriber implements EntitySubscriberInterface<MCarEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return MCarEntity;
  }

  async beforeInsert(event: InsertEvent<MCarEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<MCarEntity>) {
    const mCarEntity = <MCarEntity>event.entity;

    mCarEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    mCarEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

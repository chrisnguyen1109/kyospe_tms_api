import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { MTransportCompanyEntity } from '../entities/mTransportCompany.entity';

@EventSubscriber()
export class MTransportCompanySubscriber
  implements EntitySubscriberInterface<MTransportCompanyEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return MTransportCompanyEntity;
  }

  async beforeInsert(event: InsertEvent<MTransportCompanyEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<MTransportCompanyEntity>) {
    const mTransportCompanyEntity = <MTransportCompanyEntity>event.entity;

    mTransportCompanyEntity.updUserId =
      this.clsService.get('user')?.mUserId ?? undefined;
    mTransportCompanyEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { THighwayFeeReceiptImageEntity } from '../entities/tHighwayFeeReceiptImage.entity';

@EventSubscriber()
export class THighwayFeeReceiptImageSubscriber
  implements EntitySubscriberInterface<THighwayFeeReceiptImageEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return THighwayFeeReceiptImageEntity;
  }

  async beforeInsert(event: InsertEvent<THighwayFeeReceiptImageEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<THighwayFeeReceiptImageEntity>) {
    const tHighwayFeeReceiptImageEntity = <THighwayFeeReceiptImageEntity>(
      event.entity
    );

    tHighwayFeeReceiptImageEntity.updUserId =
      this.clsService.get('user')?.mUserId ?? undefined;
    tHighwayFeeReceiptImageEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

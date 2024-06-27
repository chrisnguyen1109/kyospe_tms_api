import { CustomClsService } from '@app/common/services/customCls.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { TCourseEntity } from '../entities/tCourse.entity';

@EventSubscriber()
export class TCourseSubscriber
  implements EntitySubscriberInterface<TCourseEntity>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return TCourseEntity;
  }

  async beforeInsert(event: InsertEvent<TCourseEntity>) {
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<TCourseEntity>) {
    const tCourseEntity = <TCourseEntity>event.entity;

    tCourseEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    tCourseEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

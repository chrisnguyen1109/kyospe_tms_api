import { CustomClsService } from '@app/common/services/customCls.service';
import { MUserEntity } from '@app/database/entities/mUser.entity';
import argon from 'argon2';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class MUserSubscriber implements EntitySubscriberInterface<MUserEntity> {
  private passwordTmp: string;

  constructor(
    private readonly dataSource: DataSource,
    private readonly clsService: CustomClsService,
  ) {
    this.dataSource.subscribers.push(this);
  }

  listenTo() {
    return MUserEntity;
  }

  afterLoad(entity: MUserEntity) {
    this.passwordTmp = entity.password;
  }

  async beforeInsert(event: InsertEvent<MUserEntity>) {
    event.entity.password = await argon.hash(event.entity.password);
    event.entity.regiUserId = this.clsService.get('user')?.mUserId;
    event.entity.regiTerminalIpAddr = this.clsService.get('ip');
  }

  async beforeUpdate(event: UpdateEvent<MUserEntity>) {
    const mUserEntity = <MUserEntity>event.entity;

    if (this.passwordTmp !== mUserEntity.password) {
      mUserEntity.password = await argon.hash(mUserEntity.password);
    }

    mUserEntity.updUserId = this.clsService.get('user')?.mUserId ?? undefined;
    mUserEntity.updTerminalIpAddr = this.clsService.get('ip');
  }
}

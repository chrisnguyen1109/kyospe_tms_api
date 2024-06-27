import { RoleDiv } from '@app/common/types/div.type';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import { transformLoginUser } from '@app/common/utils/transformLoginUser.util';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MBaseEntity } from './mBase.entity';
import { MDriverEntity } from './mDriver.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { SessionEntity } from './session.entity';

@Entity()
export class MUserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: 'ユーザマスタID' })
  mUserId: number;

  @Column({ unique: true, comment: 'ユーザID', length: 256 })
  userId: string;

  @Column({ comment: 'ユーザ名称', length: 128 })
  userNm: string;

  @Column({
    comment: 'ユーザ名称_かな',
    length: 128,
  })
  userNmKn: string;

  @Column({
    unique: true,
    comment: 'メールアドレス',
    length: 256,
    nullable: true,
  })
  mailAddress?: string;

  @Column({ type: 'char', length: 2, comment: '権限区分' })
  roleDiv: RoleDiv;

  @Column({ comment: 'パスワード', length: 128 })
  password: string;

  @Column({
    nullable: true,
    comment: 'メイン拠点ID',
  })
  mainBaseId?: number;

  @ManyToOne(() => MBaseEntity, mBase => mBase.mUsers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('mainBaseId') })
  mainBase?: MBaseEntity;

  @Column({
    nullable: true,
    comment: '運送会社ID',
  })
  transportCompanyId?: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.mUsers,
    { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true },
  )
  @JoinColumn({ name: formatColumnName('transportCompanyId') })
  transportCompany?: MTransportCompanyEntity;

  @OneToMany(() => SessionEntity, session => session.mUser, {
    cascade: true,
  })
  sessions: SessionEntity[];

  @Column({
    nullable: true,
    comment: '配送員ID',
  })
  driverId?: number;

  @ManyToOne(() => MDriverEntity, mDriver => mDriver.mUsers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('driverId') })
  driver?: MDriverEntity;

  toLoginUser() {
    return transformLoginUser(this);
  }

  get parentCompanyId() {
    return this.transportCompany?.parentCompanyId;
  }
}

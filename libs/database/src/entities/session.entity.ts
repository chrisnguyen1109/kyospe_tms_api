import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MUserEntity } from './mUser.entity';

@Entity()
export class SessionEntity {
  @PrimaryColumn()
  mUserId: number;

  @PrimaryColumn()
  sessionId: string;

  @Column()
  jwtId: string;

  @Column({ nullable: true })
  expireTime?: Date;

  @ManyToOne(() => MUserEntity, mUser => mUser.sessions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('mUserId') })
  mUser: MUserEntity;
}

import { formatColumnName } from '@app/common/utils/formatColumnName.util';
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
import { MCourseTripRelationshipEntity } from './mCourseTripRelationship.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { TCourseEntity } from './tCourse.entity';

@Entity()
export class MCourseEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: 'コース枠ID' })
  courseId: number;

  @Column({
    nullable: true,
    comment: 'コース名称',
    length: 128,
  })
  courseNm?: string;

  @Column({
    type: 'time',
    nullable: true,
    comment: '運行開始時間',
  })
  serviceStartTime?: string;

  @Column({
    type: 'time',
    nullable: true,
    comment: '運行終了時間',
  })
  serviceEndTime?: string;

  @Column({
    default: false,
    comment: 'チャーターフラグ',
  })
  charterFlg: boolean;

  @Column({
    nullable: true,
    comment: '運送会社ID',
  })
  transportCompanyId?: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.mCourses,
    { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true },
  )
  @JoinColumn({ name: formatColumnName('transportCompanyId') })
  transportCompany?: MTransportCompanyEntity;

  @Column({
    nullable: true,
    comment: '出発拠点ID',
  })
  startBaseId?: number;

  @ManyToOne(() => MBaseEntity, mBase => mBase.startMCourses, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('startBaseId') })
  startBase?: MBaseEntity;

  @Column({
    nullable: true,
    comment: '到着拠点ID',
  })
  arriveBaseId?: number;

  @ManyToOne(() => MBaseEntity, mBase => mBase.arriveMCourses, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('arriveBaseId') })
  arriveBase?: MBaseEntity;

  @OneToMany(() => TCourseEntity, tCourse => tCourse.course, { cascade: true })
  tCourses: TCourseEntity[];

  @OneToMany(
    () => MCourseTripRelationshipEntity,
    mCourseTripRelationship => mCourseTripRelationship.course,
    { cascade: true },
  )
  mCourseTripRelationships: MCourseTripRelationshipEntity[];
}

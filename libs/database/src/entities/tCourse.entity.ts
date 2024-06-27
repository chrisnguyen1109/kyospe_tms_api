import {
  DeliveryStatusDiv,
  DispatchStatusDiv,
} from '@app/common/types/div.type';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MBaseEntity } from './mBase.entity';
import { MCarEntity } from './mCar.entity';
import { MCourseEntity } from './mCourse.entity';
import { MDriverEntity } from './mDriver.entity';
import { MTransportCompanyEntity } from './mTransportCompany.entity';
import { TGpsActEntity } from './tGpsAct.entity';
import { THighwayFeeEntity } from './tHighwayFee.entity';
import { TTripEntity } from './tTrip.entity';

@Entity()
export class TCourseEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({
    comment: 'コースシーケンスNo.',
  })
  courseSeqNo: number;

  @Column({ nullable: true, comment: 'コース枠ID' })
  courseId?: number;

  @ManyToOne(() => MCourseEntity, mCourse => mCourse.tCourses, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('courseId') })
  course?: MCourseEntity;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '配車状況区分',
  })
  dispatchStatusDiv?: DispatchStatusDiv;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '配送状況区分',
  })
  deliveryStatusDiv?: DeliveryStatusDiv;

  @Column({ type: 'date', nullable: true, comment: '運行日付' })
  serviceYmd?: string;

  @Column({
    type: 'time',
    nullable: true,
    comment: '開始予定時間',
  })
  startTime?: string;

  @Column({ type: 'time', nullable: true, comment: '終了予定時間' })
  endTime?: string;

  @Column({
    nullable: true,
    comment: '出発拠点ID',
  })
  startBaseId?: number;

  @ManyToOne(() => MBaseEntity, mBase => mBase.startTCourses, {
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

  @ManyToOne(() => MBaseEntity, mBase => mBase.arriveTCourses, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('arriveBaseId') })
  arriveBase?: MBaseEntity;

  @Column({
    nullable: true,
    comment: '運送会社ID',
  })
  transportCompanyId?: number;

  @ManyToOne(
    () => MTransportCompanyEntity,
    mTransportCompany => mTransportCompany.tCourses,
    { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true },
  )
  @JoinColumn({ name: formatColumnName('transportCompanyId') })
  transportCompany?: MTransportCompanyEntity;

  @Column({ nullable: true, comment: '車両ID' })
  carId?: number;

  @ManyToOne(() => MCarEntity, mCar => mCar.tCourses, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('carId') })
  car?: MCarEntity;

  @Column({ nullable: true, comment: '配送員ID' })
  driverId?: number;

  @ManyToOne(() => MDriverEntity, mDriver => mDriver.tCourses, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('driverId') })
  driver?: MDriverEntity;

  @Column({
    type: 'time',
    nullable: true,
    comment: '実績_開始時間',
  })
  actualStartTime?: string;

  @Column({
    type: 'time',
    nullable: true,
    comment: '実績_終了時間',
  })
  actualEndTime?: string;

  @Column({
    nullable: true,
    comment: '移動距離;m単位',
  })
  transitDistance?: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: '看板写真1',
  })
  signboardPhoto1?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '看板写真2',
  })
  signboardPhoto2?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '看板写真3',
  })
  signboardPhoto3?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '看板写真4',
  })
  signboardPhoto4?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '看板写真5',
  })
  signboardPhoto5?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '看板写真6',
  })
  signboardPhoto6?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '備考',
  })
  memo?: string;

  @DeleteDateColumn({
    nullable: true,
    comment: '削除日時',
  })
  deleteAt?: Date;

  @OneToMany(() => TTripEntity, tTrip => tTrip.tCourse, { cascade: true })
  tTrips: TTripEntity[];

  @OneToMany(() => THighwayFeeEntity, tHighwayFee => tHighwayFee.tCourse, {
    cascade: true,
  })
  tHighwayFees: THighwayFeeEntity[];

  @OneToMany(() => TGpsActEntity, tGpsAct => tGpsAct.tCourse, {
    cascade: true,
  })
  tGpsActs: TGpsActEntity[];

  isFullPhoto() {
    return [
      this.signboardPhoto1,
      this.signboardPhoto2,
      this.signboardPhoto3,
      this.signboardPhoto4,
      this.signboardPhoto5,
      this.signboardPhoto6,
    ].every(value => value != undefined);
  }

  getEmptyPhotoIndex() {
    return ([
      this.signboardPhoto1,
      this.signboardPhoto2,
      this.signboardPhoto3,
      this.signboardPhoto4,
      this.signboardPhoto5,
      this.signboardPhoto6,
    ].findIndex(value => value == undefined) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  }
}

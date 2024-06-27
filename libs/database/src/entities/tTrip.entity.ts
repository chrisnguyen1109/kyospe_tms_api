import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TCourseEntity } from './tCourse.entity';
import { TSlipHeaderEntity } from './tSlipHeader.entity';
import { MBaseEntity } from './mBase.entity';
import { TSpotEntity } from './tSpot.entity';

@Unique(['slipNo', 'serviceYmd'])
@Index(['serviceYmd'], { unique: false })
@Entity()
export class TTripEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: 'トリップID' })
  tripId: number;

  @Column({ comment: '伝票No.', length: 11 })
  slipNo: string;

  @ManyToOne(() => TSlipHeaderEntity, tSlipHeader => tSlipHeader.tTrips, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('slipNo') })
  tSlipHeader: TSlipHeaderEntity;

  @Column({
    nullable: true,
    comment: 'コースシーケンスNo.',
  })
  courseSeqNo?: number;

  @ManyToOne(() => TCourseEntity, tCourse => tCourse.tTrips, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('courseSeqNo') })
  tCourse?: TCourseEntity;

  @Column({ type: 'date', nullable: true, comment: '運行日付' })
  serviceYmd?: string;

  @Column({
    nullable: true,
    comment: '出発拠点ID',
  })
  startBaseId?: number;

  @ManyToOne(() => MBaseEntity, mBase => mBase.startTrips, {
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

  @ManyToOne(() => MBaseEntity, mBase => mBase.arriveTrips, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('arriveBaseId') })
  arriveBase?: MBaseEntity;

  @DeleteDateColumn({
    nullable: true,
    comment: '削除日時',
  })
  deleteAt?: Date;

  @OneToMany(() => TSpotEntity, tSpot => tSpot.trip, {
    cascade: ['insert', 'update', 'remove'],
  })
  tSpots: TSpotEntity[];
}

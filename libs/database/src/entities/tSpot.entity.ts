import { SpotDiv, StatusDiv, WorkKindsDiv } from '@app/common/types/div.type';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TTripEntity } from './tTrip.entity';
import { MBaseEntity } from './mBase.entity';

@Entity()
export class TSpotEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ comment: 'スポットID' })
  spotId: number;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: 'ステータス',
  })
  statusDiv?: StatusDiv;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment:
      'スポット区分;01：出荷倉庫\r\n02：入荷倉庫\r\n03：納品先現場\r\n11：仕入先',
  })
  spotDiv?: SpotDiv;

  @Column({ nullable: true, comment: '拠点ID' })
  baseId?: number;

  @Column({
    nullable: true,
    comment: '拠点名称',
    length: 128,
  })
  baseNm?: string;

  @ManyToOne(() => MBaseEntity, mBase => mBase.tSpots, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: formatColumnName('baseId') })
  base?: MBaseEntity;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '緯度',
    precision: 17,
    scale: 14,
  })
  latitude?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '経度',
    precision: 17,
    scale: 14,
  })
  longitude?: string;

  @Column({
    nullable: true,
    comment: '電話番号',
    length: 15,
  })
  telNumber?: string;

  @Column({
    type: 'char',
    nullable: true,
    comment: '郵便番号',
    length: 7,
  })
  postCd?: string;

  @Column({
    nullable: true,
    comment: '住所1',
    length: 256,
  })
  address1?: string;

  @Column({
    nullable: true,
    comment: '住所2',
    length: 256,
  })
  address2?: string;

  @Column({
    nullable: true,
    comment: '住所3',
    length: 256,
  })
  address3?: string;

  @Column({ nullable: true, comment: '順番' })
  order?: number;

  @Column({
    type: 'time',
    nullable: true,
    comment: '作業終了時間;終了時間のみ実績値',
  })
  workEndTime?: string;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment:
      '作業種別区分;積込、荷降ろし　など\r\n区分より、テキストが良いかも？',
  })
  workKindsDiv?: WorkKindsDiv;

  @Column({ type: 'text', nullable: true, comment: '作業メモ' })
  workMemo?: string;

  @Column({
    default: false,
    comment: '確定フラグ',
  })
  fixedFlg: boolean;

  @Column({ comment: 'トリップID' })
  tripId: number;

  @ManyToOne(() => TTripEntity, tTrip => tTrip.tSpots, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('tripId') })
  trip: TTripEntity;
}

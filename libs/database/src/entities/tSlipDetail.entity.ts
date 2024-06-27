import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TSlipHeaderEntity } from './tSlipHeader.entity';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import { TSlipDeadlineEntity } from './tSlipDeadline.entity';

@Entity()
export class TSlipDetailEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: '伝票No.',
    length: 11,
  })
  slipNo: string;

  @PrimaryColumn({ comment: '行No.' })
  gyoNo: number;

  @ManyToOne(() => TSlipHeaderEntity, tSlipHeader => tSlipHeader.tSlipDetails, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('slipNo') })
  tSlipHeader: TSlipHeaderEntity;

  @Column({
    nullable: true,
    comment: '商品名称',
    length: 128,
  })
  productNm?: string;

  @Column({
    nullable: true,
    comment: 'サイズ',
    length: 128,
  })
  size?: string;

  @Column({ nullable: true, comment: '入数' })
  quantityPerCase?: number;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: 'ケース数量',
    precision: 10,
    scale: 2,
  })
  numberOfCases?: string;

  @Column({
    nullable: true,
    comment: 'ケース単位',
    length: 4,
  })
  unitPerCase?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: 'バラ数量',
    precision: 10,
    scale: 2,
  })
  numberOfItems?: string;

  @Column({
    nullable: true,
    comment: 'バラ単位',
    length: 4,
  })
  unitPerItem?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '総バラ数量',
    precision: 10,
    scale: 2,
  })
  totalNumber?: string;

  @Column({
    nullable: true,
    comment: '発注に対する受注伝票No.',
    length: 11,
  })
  slipNoForPurchaseOrder?: string;

  @Column({
    nullable: true,
    comment: '発注に対する受注SeqNo.',
  })
  seqNoForPurchaseOrder?: number;

  @Column({
    nullable: true,
    comment: '発注に対する受注行No.',
  })
  gyoNoForPurchaseOrder?: number;

  @Column({ type: 'text', nullable: true, comment: '備考' })
  remarks?: string;

  @DeleteDateColumn({
    nullable: true,
    comment: '削除日時',
  })
  deleteAt?: Date;

  @OneToMany(
    () => TSlipDeadlineEntity,
    tSlipDeadline => tSlipDeadline.tSlipDetail,
    { cascade: true },
  )
  tSlipDeadlines: TSlipDeadlineEntity[];
}

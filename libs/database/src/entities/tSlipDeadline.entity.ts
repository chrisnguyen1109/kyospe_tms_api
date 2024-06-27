import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TSlipDetailEntity } from './tSlipDetail.entity';

@Entity()
export class TSlipDeadlineEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: '伝票No.',
    length: 11,
  })
  slipNo: string;

  @PrimaryColumn({ comment: '行No.' })
  gyoNo: number;

  @PrimaryColumn({ comment: '納期行No' })
  deadlineNo: number;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: 'ケース数量',
    precision: 10,
    scale: 2,
  })
  numberOfCases?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: 'バラ数量',
    precision: 10,
    scale: 2,
  })
  numberOfItems?: string;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '総バラ数量',
    precision: 10,
    scale: 2,
  })
  totalNumber?: string;

  @Column({ type: 'date', comment: '納期日' })
  deadline: string;

  @DeleteDateColumn({
    nullable: true,
    comment: '削除日時',
  })
  deleteAt?: Date;

  @ManyToOne(
    () => TSlipDetailEntity,
    tSlipDetail => tSlipDetail.tSlipDeadlines,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: formatColumnName('slipNo'), referencedColumnName: 'slipNo' },
    { name: formatColumnName('gyoNo'), referencedColumnName: 'gyoNo' },
  ])
  tSlipDetail: TSlipDetailEntity;
}

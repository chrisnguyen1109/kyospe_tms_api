import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { THighwayFeeEntity } from './tHighwayFee.entity';

@Entity()
export class THighwayFeeReceiptImageEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({
    comment: '領収書画像No',
  })
  imageNo: number;

  @Column({ comment: '高速利用料金No.' })
  highwayFeeNo: number;

  @ManyToOne(
    () => THighwayFeeEntity,
    tHighwayFee => tHighwayFee.tHighwayFeeReceiptImages,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: formatColumnName('highwayFeeNo') })
  tHighwayFee: THighwayFeeEntity;

  @Column({
    type: 'text',
    nullable: true,
    comment: '領収書画像',
  })
  receiptImage?: string;
}

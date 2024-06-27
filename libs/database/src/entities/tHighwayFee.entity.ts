import { PaymentMethodDiv } from '@app/common/types/div.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TCourseEntity } from './tCourse.entity';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';
import { THighwayFeeReceiptImageEntity } from './tHighwayFeeReceiptImage.entity';

@Entity()
export class THighwayFeeEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({
    comment: '高速利用料金No.',
  })
  highwayFeeNo: number;

  @Column({ comment: 'コースシーケンスNo.' })
  courseSeqNo: number;

  @ManyToOne(() => TCourseEntity, tCourse => tCourse.tHighwayFees, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('courseSeqNo') })
  tCourse: TCourseEntity;

  @Column({
    type: 'char',
    length: 2,
    nullable: true,
    comment: '支払方法区分',
  })
  paymentMethodDiv?: PaymentMethodDiv;

  @Column({
    type: 'decimal',
    nullable: true,
    comment: '金額',
    precision: 10,
    scale: 0,
  })
  amount?: string;

  @OneToMany(
    () => THighwayFeeReceiptImageEntity,
    tHighwayFeeReceiptImage => tHighwayFeeReceiptImage.tHighwayFee,
  )
  tHighwayFeeReceiptImages: THighwayFeeReceiptImageEntity[];
}

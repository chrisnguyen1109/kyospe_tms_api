import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MDivEntity } from './mDiv.entity';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';

@Entity()
export class MDivValueEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: '区分CD',
    length: 8,
  })
  divCd: string;

  @PrimaryColumn({
    type: 'char',
    comment: '区分値',
    length: 2,
  })
  divValue: string;

  @Column({
    comment: '区分値名称',
    length: 128,
  })
  divValueNm: string;

  @ManyToOne(() => MDivEntity, mDiv => mDiv.mDivValues, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('divCd') })
  mDiv: MDivEntity;
}

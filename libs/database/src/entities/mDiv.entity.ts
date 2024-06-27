import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { MDivValueEntity } from './mDivValue.entity';

@Entity()
export class MDivEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: '区分CD',
    length: 8,
  })
  divCd: string;

  @Column({ comment: '区分名称', length: 128 })
  divNm: string;

  @OneToMany(() => MDivValueEntity, mDivValue => mDivValue.mDiv, {
    cascade: true,
  })
  mDivValues: MDivValueEntity[];
}

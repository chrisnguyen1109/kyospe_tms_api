import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { TCourseEntity } from './tCourse.entity';
import { formatColumnName } from '@app/common/utils/formatColumnName.util';

@Entity()
export class TGpsActEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: '位置情報実績キー',
    length: 30,
  })
  gpsActKey: string;

  @Column({
    comment: 'コースシーケンスNo.',
  })
  courseSeqNo: number;

  @ManyToOne(() => TCourseEntity, tCourse => tCourse.tGpsActs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: formatColumnName('courseSeqNo') })
  tCourse: TCourseEntity;

  @Column({
    type: 'decimal',
    comment: '緯度',
    precision: 17,
    scale: 14,
  })
  latitude: string;

  @Column({
    type: 'decimal',
    comment: '経度',
    precision: 17,
    scale: 14,
  })
  longitude: string;

  @Column({
    comment: '移動距離',
  })
  distance: number;
}

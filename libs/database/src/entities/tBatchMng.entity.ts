import { Column, Entity, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class TBatchMngEntity extends AbstractEntity {
  @PrimaryColumn({
    comment: 'バッチ管理ID',
    length: 20,
  })
  batchMngId: string;

  @Column({ type: 'datetime', comment: '前回実行時間' })
  lastExecTime: Date;

  @Column({ type: 'datetime', comment: '今回実行時間' })
  thisExecTime: Date;
}

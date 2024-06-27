import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
  @Column({
    nullable: true,
    comment: '登録プログラムID',
    length: 50,
  })
  regiPgId?: string;

  @CreateDateColumn({ comment: '登録日時', nullable: true })
  regiDatetime?: Date;

  @Column({
    type: 'int',
    nullable: true,
    comment: '登録ユーザID',
  })
  regiUserId?: number;

  @Column({
    nullable: true,
    comment: '登録端末IPアドレス',
    length: 45,
  })
  regiTerminalIpAddr?: string;

  @Column({
    nullable: true,
    comment: '更新プログラム',
    length: 50,
  })
  updPgId?: string;

  @UpdateDateColumn({ comment: '更新日時', nullable: true })
  updDatetime?: Date;

  @Column({
    type: 'int',
    nullable: true,
    comment: '更新ユーザID',
  })
  updUserId?: number;

  @Column({
    nullable: true,
    comment: '更新端末IPアドレス',
    length: 45,
  })
  updTerminalIpAddr?: string;
}

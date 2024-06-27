import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTBatchMngTable1688609752837 implements MigrationInterface {
  name = 'CreateTBatchMngTable1688609752837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`T_BATCH_MNG\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`BATCH_MNG_ID\` varchar(20) NOT NULL COMMENT 'バッチ管理ID', \`LAST_EXEC_TIME\` datetime NOT NULL COMMENT '前回実行時間', \`THIS_EXEC_TIME\` datetime NOT NULL COMMENT '今回実行時間', PRIMARY KEY (\`BATCH_MNG_ID\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`T_BATCH_MNG\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMCngTransportCompanyTable1689582824142
  implements MigrationInterface
{
  name = 'CreateMCngTransportCompanyTable1689582824142';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`M_CNG_TRANSPORT_COMPANY\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`CNG_TRANSPORT_COMPANY_ID\` int NOT NULL AUTO_INCREMENT COMMENT '運送会社変換ID', \`COMPANY_CD\` varchar(2) NOT NULL COMMENT '配送業者CD', \`TRANSPORT_COMPANY_ID\` int NOT NULL COMMENT '運送会社ID', \`KADAI_FLG\` tinyint NOT NULL COMMENT '架台フラグ' DEFAULT 0, UNIQUE INDEX \`IDX_091c201cfcebe9b3ec12587c71\` (\`COMPANY_CD\`), PRIMARY KEY (\`CNG_TRANSPORT_COMPANY_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`KADAI_FLG\` tinyint NOT NULL COMMENT '架台フラグ' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` ADD \`FIXED_FLG\` tinyint NOT NULL COMMENT '確定フラグ' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CNG_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_b8cd3dafe3437bbac4f5149dcf6\` FOREIGN KEY (\`TRANSPORT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_CNG_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_b8cd3dafe3437bbac4f5149dcf6\``,
    );
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` DROP COLUMN \`FIXED_FLG\``);
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`KADAI_FLG\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_091c201cfcebe9b3ec12587c71\` ON \`M_CNG_TRANSPORT_COMPANY\``,
    );
    await queryRunner.query(`DROP TABLE \`M_CNG_TRANSPORT_COMPANY\``);
  }
}

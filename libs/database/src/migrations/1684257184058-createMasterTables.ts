import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMasterTables1684257184058 implements MigrationInterface {
  name = 'CreateMasterTables1684257184058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`M_DRIVER\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`DRIVER_ID\` int NOT NULL AUTO_INCREMENT COMMENT '配送員ID', \`DRIVER_NM\` varchar(128) NOT NULL COMMENT '配送員名称', \`DRIVER_NM_KN\` varchar(128) NOT NULL COMMENT '配送員名称ふりがな', \`TEL_NUMBER\` varchar(11) NULL COMMENT '電話番号', \`CAR_ID\` int NULL COMMENT '車両ID', \`TRANSPORT_COMPANY_ID\` int NOT NULL COMMENT '運送会社ID', \`CAR_CAR_ID\` int NULL COMMENT '車両ID', PRIMARY KEY (\`DRIVER_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`M_CAR\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`CAR_ID\` int NOT NULL AUTO_INCREMENT COMMENT '車両ID', \`CAR_TYPE\` char(2) NOT NULL COMMENT '車両タイプ', \`CAR_SIZE\` char(2) NOT NULL COMMENT '車格', \`CAR_MANAGEMENT_NUM\` varchar(50) NOT NULL COMMENT '車両管理番号', \`LEASE_START_YMD\` date NULL COMMENT 'リース開始日付', \`LEASE_END_YMD\` date NULL COMMENT 'リース終了日付', \`OWNING_COMPANY_ID\` int NOT NULL COMMENT '所有会社ID', PRIMARY KEY (\`CAR_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`M_USER\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`M_USER_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'ユーザマスタID', \`USER_ID\` varchar(256) NOT NULL COMMENT 'ユーザID', \`USER_NM\` varchar(128) NOT NULL COMMENT 'ユーザ名称', \`USER_NM_KN\` varchar(128) NOT NULL COMMENT 'ユーザ名称_かな', \`MAIL_ADDRESS\` varchar(256) NOT NULL COMMENT 'メールアドレス', \`ROLE_DIV\` enum ('01', '02', '03', '04') NOT NULL COMMENT '権限区分', \`PASSWORD\` varchar(128) NOT NULL COMMENT 'パスワード', \`MAIN_BASE_ID\` int NULL COMMENT 'メイン拠点ID', \`TRANSPORT_COMPANY_ID\` int NULL COMMENT '運送会社ID', UNIQUE INDEX \`IDX_0c23b9dc07d43bed0f4a91d5f6\` (\`USER_ID\`), UNIQUE INDEX \`IDX_de0925db521311ea1c5cb00aec\` (\`MAIL_ADDRESS\`), PRIMARY KEY (\`M_USER_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`CREATE TABLE \`M_TRANSPORT_COMPANY\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`TRANSPORT_COMPANY_ID\` int NOT NULL AUTO_INCREMENT COMMENT '運送会社ID', \`TRANSPORT_COMPANY_NM\` varchar(128) NOT NULL COMMENT '運送会社名称', \`TEL_NUMBER\` varchar(11) NULL COMMENT '電話番号', \`CARRIAGE_FLG\` tinyint NOT NULL COMMENT '庸車フラグ:庸車の場合「1」' DEFAULT 0, \`PARENT_COMPANY_ID\` int NULL COMMENT '親会社ID:庸車の場合、親となる運送会社IDを設定する。', \`CARRIAGE_BASE_ID\` int NULL COMMENT '庸車拠点ID:庸車の場合、業者がセンターに紐づいている。
同じ会社が複数のセンターに紐づく場合もある。', PRIMARY KEY (\`TRANSPORT_COMPANY_ID\`)) ENGINE=InnoDB`);
    await queryRunner.query(`CREATE TABLE \`M_BASE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`BASE_ID\` int NOT NULL AUTO_INCREMENT COMMENT '拠点ID', \`BASE_CD\` varchar(7) NOT NULL COMMENT '拠点コード', \`BASE_EDA\` varchar(4) NULL COMMENT '拠点枝番', \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先', \`BASE_NM_1\` varchar(128) NOT NULL COMMENT '拠点名称１', \`BASE_NM_2\` varchar(128) NULL COMMENT '拠点名称２', \`BASE_NM_AB\` varchar(128) NULL COMMENT '拠点名称略称', \`BAS_NM_KN\` varchar(128) NOT NULL COMMENT '拠点名称ふりがな', \`TEL_NUMBER\` varchar(11) NULL COMMENT '電話番号', \`LATITUDE\` decimal(17,14) NULL COMMENT '緯度', \`LONGITUDE\` decimal(17,14) NULL COMMENT '経度', \`POST_CD\` decimal(17,14) NOT NULL COMMENT '郵便番号', \`ADDRESS_1\` varchar(256) NOT NULL COMMENT '住所１', \`ADDRESS_2\` varchar(256) NULL COMMENT '住所２', \`ADDRESS_3\` varchar(256) NULL COMMENT '住所３', \`BASE_MEMO\` varchar(255) NULL COMMENT '地点メモ', PRIMARY KEY (\`BASE_ID\`)) ENGINE=InnoDB`);
    await queryRunner.query(
      `CREATE TABLE \`M_DIV_VALUE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`DIV_CD\` varchar(8) NOT NULL COMMENT '区分CD', \`DIV_VALUE\` char(2) NOT NULL COMMENT '区分値', \`DIV_VALUE_NM\` varchar(128) NOT NULL COMMENT '区分値名称', PRIMARY KEY (\`DIV_CD\`, \`DIV_VALUE\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`M_DIV\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス', \`DIV_CD\` varchar(8) NOT NULL COMMENT '区分CD', \`DIV_NM\` varchar(128) NOT NULL COMMENT '区分名称', PRIMARY KEY (\`DIV_CD\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD CONSTRAINT \`FK_c0c85c8d3a66cf248c0f56f8d81\` FOREIGN KEY (\`CAR_CAR_ID\`) REFERENCES \`M_CAR\`(\`CAR_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD CONSTRAINT \`FK_374ca5db361a3f883f86f3d2ac7\` FOREIGN KEY (\`TRANSPORT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD CONSTRAINT \`FK_3a72c37b6e38afad1f546afd6d4\` FOREIGN KEY (\`OWNING_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD CONSTRAINT \`FK_30786b9d651c87505c58be2c076\` FOREIGN KEY (\`MAIN_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD CONSTRAINT \`FK_3831437bbbc7d5f4cfe60f3027c\` FOREIGN KEY (\`TRANSPORT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_499b635afb25e86fc3352196a07\` FOREIGN KEY (\`PARENT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_417faeaaa6b457858891976c272\` FOREIGN KEY (\`CARRIAGE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` ADD CONSTRAINT \`FK_f6490d46ab6b9a96e7b266b6a03\` FOREIGN KEY (\`DIV_CD\`) REFERENCES \`M_DIV\`(\`DIV_CD\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` DROP FOREIGN KEY \`FK_f6490d46ab6b9a96e7b266b6a03\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_417faeaaa6b457858891976c272\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_499b635afb25e86fc3352196a07\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP FOREIGN KEY \`FK_3831437bbbc7d5f4cfe60f3027c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP FOREIGN KEY \`FK_30786b9d651c87505c58be2c076\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` DROP FOREIGN KEY \`FK_3a72c37b6e38afad1f546afd6d4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP FOREIGN KEY \`FK_374ca5db361a3f883f86f3d2ac7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP FOREIGN KEY \`FK_c0c85c8d3a66cf248c0f56f8d81\``,
    );
    await queryRunner.query(`DROP TABLE \`M_DIV\``);
    await queryRunner.query(`DROP TABLE \`M_DIV_VALUE\``);
    await queryRunner.query(`DROP TABLE \`M_BASE\``);
    await queryRunner.query(`DROP TABLE \`M_TRANSPORT_COMPANY\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_de0925db521311ea1c5cb00aec\` ON \`M_USER\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0c23b9dc07d43bed0f4a91d5f6\` ON \`M_USER\``,
    );
    await queryRunner.query(`DROP TABLE \`M_USER\``);
    await queryRunner.query(`DROP TABLE \`M_CAR\``);
    await queryRunner.query(`DROP TABLE \`M_DRIVER\``);
  }
}

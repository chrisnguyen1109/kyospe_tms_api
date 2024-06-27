import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabase1686646270736 implements MigrationInterface {
  name = 'UpdateDatabase1686646270736';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`CARRIAGE_FLG\``,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`POST_CD\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`POST_CD\` char(7) NOT NULL COMMENT '郵便番号'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`BASE_MEMO\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`BASE_MEMO\` text NULL COMMENT '地点メモ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` CHANGE \`DRIVER_NM_KN\` \`DRIVER_NM_KN\` varchar(128) NULL COMMENT '配送員名称ふりがな'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` CHANGE \`DRIVER_NM_KN\` \`DRIVER_NM_KN\` varchar(128) NOT NULL COMMENT '配送員名称ふりがな'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`BASE_MEMO\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`BASE_MEMO\` varchar(255) NULL COMMENT '地点メモ'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`POST_CD\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`POST_CD\` decimal(17,14) NOT NULL COMMENT '郵便番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`CARRIAGE_FLG\` tinyint NOT NULL COMMENT '庸車フラグ:庸車の場合「1」' DEFAULT '0'`,
    );
  }
}

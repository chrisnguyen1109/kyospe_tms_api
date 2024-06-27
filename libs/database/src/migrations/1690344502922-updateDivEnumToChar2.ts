import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDivEnumToChar21690344502922 implements MigrationInterface {
  name = 'UpdateDivEnumToChar21690344502922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`SLIP_STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`SLIP_STATUS_DIV\` char(2) NULL COMMENT '配送状況区分'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`DELIVERY_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`DELIVERY_DIV\` char(2) NULL COMMENT '配送区分;配送、引取、直送'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` DROP COLUMN \`STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` ADD \`STATUS_DIV\` char(2) NULL COMMENT 'ステータス'`,
    );
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` DROP COLUMN \`SPOT_DIV\``);
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` ADD \`SPOT_DIV\` char(2) NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
11：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` DROP COLUMN \`WORK_KINDS_DIV\``,
    );
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` ADD \`WORK_KINDS_DIV\` char(2) NULL COMMENT '作業種別区分;積込、荷降ろし　など
区分より、テキストが良いかも？'`);
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE\` DROP COLUMN \`PAYMENT_METHOD_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE\` ADD \`PAYMENT_METHOD_DIV\` char(2) NULL COMMENT '支払方法区分'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP COLUMN \`DISPATCH_STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD \`DISPATCH_STATUS_DIV\` char(2) NULL COMMENT '配車状況区分'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP COLUMN \`DELIVERY_STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD \`DELIVERY_STATUS_DIV\` char(2) NULL COMMENT '配送状況区分'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_TYPE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_TYPE\` char(2) NOT NULL COMMENT '車両タイプ'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_SIZE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_SIZE\` char(2) NOT NULL COMMENT '車格'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_USER\` DROP COLUMN \`ROLE_DIV\``);
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`ROLE_DIV\` char(2) NOT NULL COMMENT '権限区分'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`BASE_DIV\``);
    await queryRunner.query(`ALTER TABLE \`M_BASE\` ADD \`BASE_DIV\` char(2) NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`AREA_DIV\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`AREA_DIV\` char(2) NULL COMMENT '地域区分'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`AREA_DIV\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`AREA_DIV\` enum ('01', '02') NULL COMMENT '地域区分'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`BASE_DIV\``);
    await queryRunner.query(`ALTER TABLE \`M_BASE\` ADD \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(`ALTER TABLE \`M_USER\` DROP COLUMN \`ROLE_DIV\``);
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`ROLE_DIV\` enum ('01', '02', '03', '04') NOT NULL COMMENT '権限区分'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_SIZE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_SIZE\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '車格'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_TYPE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_TYPE\` enum ('01', '02') NOT NULL COMMENT '車両タイプ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP COLUMN \`DELIVERY_STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD \`DELIVERY_STATUS_DIV\` enum ('01', '02', '03') NULL COMMENT '配送状況区分'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP COLUMN \`DISPATCH_STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD \`DISPATCH_STATUS_DIV\` enum ('01', '02') NULL COMMENT '配車状況区分'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE\` DROP COLUMN \`PAYMENT_METHOD_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE\` ADD \`PAYMENT_METHOD_DIV\` enum ('01', '02', '03', '04', '05', '06') NULL COMMENT '支払方法区分'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` DROP COLUMN \`WORK_KINDS_DIV\``,
    );
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` ADD \`WORK_KINDS_DIV\` enum ('01', '02') NULL COMMENT '作業種別区分;積込、荷降ろし　など
区分より、テキストが良いかも？'`);
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` DROP COLUMN \`SPOT_DIV\``);
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` ADD \`SPOT_DIV\` enum ('01', '02', '03', '11') NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
11：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` DROP COLUMN \`STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` ADD \`STATUS_DIV\` enum ('01', '02', '03') NULL COMMENT 'ステータス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`DELIVERY_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`DELIVERY_DIV\` enum ('01', '02', '03') NULL COMMENT '配送区分;配送、引取、直送'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`SLIP_STATUS_DIV\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`SLIP_STATUS_DIV\` enum ('01', '02', '03') NULL COMMENT '配送状況区分'`,
    );
  }
}

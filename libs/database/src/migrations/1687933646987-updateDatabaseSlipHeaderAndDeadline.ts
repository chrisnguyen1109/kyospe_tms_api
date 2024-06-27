import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabaseSlipHeaderAndDeadline1687933646987
  implements MigrationInterface
{
  name = 'UpdateDatabaseSlipHeaderAndDeadline1687933646987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` DROP COLUMN \`NUMBER_OF_ITEMS\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` ADD \`NUMBER_OF_ITEMS\` decimal(10,2) NULL COMMENT 'バラ数量'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`PICKUP_INFORMATION\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`PICKUP_INFORMATION\` varchar(50) NULL COMMENT '引取情報'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`REMARKS\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`REMARKS\` varchar(50) NULL COMMENT '備考'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`REMARKS\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`REMARKS\` text NULL COMMENT '備考'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`PICKUP_INFORMATION\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`PICKUP_INFORMATION\` text NULL COMMENT '引取情報'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` DROP COLUMN \`NUMBER_OF_ITEMS\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` ADD \`NUMBER_OF_ITEMS\` varchar(4) NULL COMMENT 'バラ数量'`,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRequestDateType1692949920413 implements MigrationInterface {
  name = 'AlterRequestDateType1692949920413';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` MODIFY \`REQUEST_DATE\` varchar(15) NULL COMMENT '配達希望時間'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` MODIFY \`REQUEST_DATE\` date NULL COMMENT '配達希望時間'`,
    );
  }
}

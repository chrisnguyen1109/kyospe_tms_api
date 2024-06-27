import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTelLengthAndAddFieldsToTSlipHeader1690792173841
  implements MigrationInterface
{
  name = 'AlterTelLengthAndAddFieldsToTSlipHeader1690792173841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`REQUEST_DATE\` date NULL COMMENT '配達希望時間'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD \`DELIVERY_MEMO\` text NULL COMMENT '配送メモ'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` MODIFY \`TEL_NUMBER\` varchar(15) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` MODIFY \`TEL_NUMBER\` varchar(15) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` MODIFY \`TEL_NUMBER\` varchar(15) NULL COMMENT '電話番号'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` MODIFY \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` MODIFY \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` MODIFY \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`DELIVERY_MEMO\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP COLUMN \`REQUEST_DATE\``,
    );
  }
}

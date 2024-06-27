import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTelNumberLength11To131685353956007
  implements MigrationInterface
{
  name = 'ChangeTelNumberLength11To131685353956007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`TEL_NUMBER\` varchar(11) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`TEL_NUMBER\` varchar(11) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`TEL_NUMBER\` varchar(11) NULL COMMENT '電話番号'`,
    );
  }
}

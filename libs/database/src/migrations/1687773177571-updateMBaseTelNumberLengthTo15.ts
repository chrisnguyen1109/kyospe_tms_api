import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMBaseTelNumberLengthTo151687773177571
  implements MigrationInterface
{
  name = 'UpdateMBaseTelNumberLengthTo151687773177571';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP FOREIGN KEY \`FK_a87753d706a38093d5848ffd15a\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a87753d706a38093d5848ffd15\` ON \`T_SLIP_HEADER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`TEL_NUMBER\` varchar(15) NULL COMMENT '電話番号'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`TEL_NUMBER\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_a87753d706a38093d5848ffd15\` ON \`T_SLIP_HEADER\` (\`SLIP_NO_FOR_PURCHASE_ORDER\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD CONSTRAINT \`FK_a87753d706a38093d5848ffd15a\` FOREIGN KEY (\`SLIP_NO_FOR_PURCHASE_ORDER\`) REFERENCES \`T_SLIP_HEADER\`(\`SLIP_NO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

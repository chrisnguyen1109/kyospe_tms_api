import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequiredDeadlineAndSetUniqueSlipNoAndServiceYmd1688370467303
  implements MigrationInterface
{
  name = 'AddRequiredDeadlineAndSetUniqueSlipNoAndServiceYmd1688370467303';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` CHANGE \`DEADLINE\` \`DEADLINE\` date NOT NULL COMMENT '納期日'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_21106ccd2137adc469f226b377\` ON \`T_TRIP\` (\`SLIP_NO\`, \`SERVICE_YMD\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_21106ccd2137adc469f226b377\` ON \`T_TRIP\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` CHANGE \`DEADLINE\` \`DEADLINE\` date NULL COMMENT '納期日'`,
    );
  }
}

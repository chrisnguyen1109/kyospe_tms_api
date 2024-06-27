import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqueBaseCd1689841613558 implements MigrationInterface {
  name = 'RemoveUniqueBaseCd1689841613558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_4e63611f3c13264e9e49e2da5b\` ON \`M_BASE\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_4e63611f3c13264e9e49e2da5b\` ON \`M_BASE\` (\`BASE_CD\`)`,
    );
  }
}

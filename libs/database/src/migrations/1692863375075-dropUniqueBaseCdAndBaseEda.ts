import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUniqueBaseCdAndBaseEda1692863375075
  implements MigrationInterface
{
  name = 'DropUniqueBaseCdAndBaseEda1692863375075';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_417fdf66a9f0c77f2e6c0af520\` ON \`M_BASE\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_417fdf66a9f0c77f2e6c0af520\` ON \`M_BASE\` (\`BASE_CD\`, \`BASE_EDA\`)`,
    );
  }
}

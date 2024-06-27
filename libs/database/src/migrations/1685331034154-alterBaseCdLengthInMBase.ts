import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterBaseCdLengthInMBase1685331034154
  implements MigrationInterface
{
  name = 'AlterBaseCdLengthInMBase1685331034154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`BASE_CD\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`BASE_CD\` varchar(20) NOT NULL COMMENT '拠点コード'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`BASE_CD\``);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`BASE_CD\` varchar(7) NOT NULL COMMENT '拠点コード'`,
    );
  }
}

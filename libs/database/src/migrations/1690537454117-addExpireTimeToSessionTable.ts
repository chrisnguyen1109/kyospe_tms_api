import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpireTimeToSessionTable1690537454117
  implements MigrationInterface
{
  name = 'AddExpireTimeToSessionTable1690537454117';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`SESSION\` ADD \`EXPIRE_TIME\` datetime NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`SESSION\` DROP COLUMN \`EXPIRE_TIME\``,
    );
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCarsizeAndCartypeEnum1684989200757
  implements MigrationInterface
{
  name = 'AlterCarsizeAndCartypeEnum1684989200757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_TYPE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_TYPE\` enum ('01', '02') NOT NULL COMMENT '車両タイプ'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_SIZE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_SIZE\` enum ('01', '02') NOT NULL COMMENT '車格'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_SIZE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_SIZE\` char(2) NOT NULL COMMENT '車格'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_CAR\` DROP COLUMN \`CAR_TYPE\``);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`CAR_TYPE\` char(2) NOT NULL COMMENT '車両タイプ'`,
    );
  }
}

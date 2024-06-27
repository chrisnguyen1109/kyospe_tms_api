import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameTGpsActTable1690516942943 implements MigrationInterface {
  name = 'RenameTGpsActTable1690516942943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`T_GPT_ACT\` RENAME \`T_GPS_ACT\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`T_GPS_ACT\` RENAME \`T_GPT_ACT\``);
  }
}

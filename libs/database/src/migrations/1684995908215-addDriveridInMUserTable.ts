import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDriveridInMUserTable1684995908215
  implements MigrationInterface
{
  name = 'AddDriveridInMUserTable1684995908215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`DRIVER_ID\` int NULL COMMENT '配送員ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD CONSTRAINT \`FK_af11bd5e6e8ac96e9bdd73604e1\` FOREIGN KEY (\`DRIVER_ID\`) REFERENCES \`M_DRIVER\`(\`DRIVER_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP FOREIGN KEY \`FK_af11bd5e6e8ac96e9bdd73604e1\``,
    );
    await queryRunner.query(`ALTER TABLE \`M_USER\` DROP COLUMN \`DRIVER_ID\``);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCarIdInMCar1685465643663 implements MigrationInterface {
  name = 'AlterCarIdInMCar1685465643663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP FOREIGN KEY \`FK_c0c85c8d3a66cf248c0f56f8d81\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`CAR_CAR_ID\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD CONSTRAINT \`FK_6e56f9f3b43e8baf5aba1140219\` FOREIGN KEY (\`CAR_ID\`) REFERENCES \`M_CAR\`(\`CAR_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP FOREIGN KEY \`FK_6e56f9f3b43e8baf5aba1140219\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`CAR_CAR_ID\` int NULL COMMENT '車両ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD CONSTRAINT \`FK_c0c85c8d3a66cf248c0f56f8d81\` FOREIGN KEY (\`CAR_CAR_ID\`) REFERENCES \`M_CAR\`(\`CAR_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}

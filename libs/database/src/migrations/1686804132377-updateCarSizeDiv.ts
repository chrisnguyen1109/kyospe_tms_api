import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCarSizeDiv1686804132377 implements MigrationInterface {
  name = 'UpdateCarSizeDiv1686804132377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` CHANGE \`SPOT_DIV\` \`SPOT_DIV\` enum ('01', '02', '03', '04') NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
04：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` CHANGE \`CAR_SIZE\` \`CAR_SIZE\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '車格'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` CHANGE \`CAR_SIZE\` \`CAR_SIZE\` enum ('01', '02') NOT NULL COMMENT '車格'`,
    );
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` CHANGE \`SPOT_DIV\` \`SPOT_DIV\` enum ('01', '02', '03', '04') NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
11：仕入先'`);
  }
}

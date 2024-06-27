import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSpotAndSlipStatusDiv1688023168258
  implements MigrationInterface
{
  name = 'UpdateSpotAndSlipStatusDiv1688023168258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` CHANGE \`SLIP_STATUS_DIV\` \`SLIP_STATUS_DIV\` enum ('01', '02', '03') NULL COMMENT '配送状況区分'`,
    );
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` CHANGE \`SPOT_DIV\` \`SPOT_DIV\` enum ('01', '02', '03', '11') NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
11：仕入先'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`T_SPOT\` CHANGE \`SPOT_DIV\` \`SPOT_DIV\` enum ('01', '02', '03', '04') NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
04：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` CHANGE \`SLIP_STATUS_DIV\` \`SLIP_STATUS_DIV\` enum ('01', '02', '03', '04') NULL COMMENT '配送状況区分'`,
    );
  }
}

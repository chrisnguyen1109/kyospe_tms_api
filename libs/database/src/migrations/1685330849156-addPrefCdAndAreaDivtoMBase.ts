import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrefCdAndAreaDivtoMBase1685330849156
  implements MigrationInterface
{
  name = 'AddPrefCdAndAreaDivtoMBase1685330849156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`PREF_CD\` char(2) NULL COMMENT '都道府県コード'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`AREA_DIV\` enum ('01', '02') NULL COMMENT '地域区分'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` CHANGE \`BASE_DIV\` \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`M_BASE\` CHANGE \`BASE_DIV\` \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`AREA_DIV\``);
    await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`PREF_CD\``);
  }
}

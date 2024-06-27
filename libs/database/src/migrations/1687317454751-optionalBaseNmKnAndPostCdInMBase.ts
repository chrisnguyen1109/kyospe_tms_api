import { MigrationInterface, QueryRunner } from 'typeorm';

export class OptionalBaseNmKnAndPostCdInMBase1687317454751
  implements MigrationInterface
{
  name = 'OptionalBaseNmKnAndPostCdInMBase1687317454751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` ADD \`CHARTER_FLG\` tinyint NOT NULL COMMENT 'チャーターフラグ' DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`BASE_NM_KN\` \`BASE_NM_KN\` varchar(128) NULL COMMENT '拠点名称ふりがな'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`POST_CD\` \`POST_CD\` char(7) NULL COMMENT '郵便番号'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`POST_CD\` \`POST_CD\` char(7) NOT NULL COMMENT '郵便番号'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`BASE_NM_KN\` \`BASE_NM_KN\` varchar(128) NOT NULL COMMENT '拠点名称ふりがな'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` DROP COLUMN \`CHARTER_FLG\``,
    );
  }
}

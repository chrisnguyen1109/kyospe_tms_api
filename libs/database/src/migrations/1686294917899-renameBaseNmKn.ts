import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameBaseNmKn1686294917899 implements MigrationInterface {
  name = 'RenameBaseNmKn1686294917899';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`BAS_NM_KN\` \`BASE_NM_KN\` varchar(128) NOT NULL COMMENT '拠点名称ふりがな'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`BASE_NM_KN\` \`BAS_NM_KN\` varchar(128) NOT NULL COMMENT '拠点名称ふりがな'`,
    );
  }
}

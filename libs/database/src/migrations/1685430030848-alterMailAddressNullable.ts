import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterMailAddressNullable1685430030848
  implements MigrationInterface
{
  name = 'AlterMailAddressNullable1685430030848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` CHANGE \`MAIL_ADDRESS\` \`MAIL_ADDRESS\` varchar(256) NULL COMMENT 'メールアドレス'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` CHANGE \`MAIL_ADDRESS\` \`MAIL_ADDRESS\` varchar(256) NOT NULL COMMENT 'メールアドレス'`,
    );
  }
}

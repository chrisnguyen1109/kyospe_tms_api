import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterRegiUpdDateTimeNullable1685354742014
  implements MigrationInterface
{
  name = 'AlterRegiUpdDateTimeNullable1685354742014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` CHANGE \`UPD_DATETIME\` \`UPD_DATETIME\` datetime(6) NOT NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` CHANGE \`REGI_DATETIME\` \`REGI_DATETIME\` datetime(6) NOT NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }
}

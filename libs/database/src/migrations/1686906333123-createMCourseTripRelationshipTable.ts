import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMCourseTripRelationshipTable1686906333123
  implements MigrationInterface
{
  name = 'CreateMCourseTripRelationshipTable1686906333123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`M_COURSE_TRIP_RELATIONSHIP\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`COURSE_ID\` int NOT NULL COMMENT 'コース枠ID', \`TRANSPORT_COMPANY_ID\` int NULL COMMENT '運送会社ID', \`START_BASE_ADDRESS_1\` varchar(256) NULL COMMENT '出発拠点住所1', \`START_BASE_ADDRESS_2\` varchar(256) NULL COMMENT '出発拠点住所2', \`ARRIVE_BASE_ADDRESS_1\` varchar(256) NULL COMMENT '到着拠点住所1', \`ARRIVE_BASE_ADDRESS_2\` varchar(256) NULL COMMENT '到着拠点住所2', PRIMARY KEY (\`COURSE_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` ADD CONSTRAINT \`FK_b77d1fdfb326bb51ef9bdc04a2b\` FOREIGN KEY (\`COURSE_ID\`) REFERENCES \`M_COURSE\`(\`COURSE_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` ADD CONSTRAINT \`FK_6e6f33047015a47b8683d36912a\` FOREIGN KEY (\`TRANSPORT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP FOREIGN KEY \`FK_6e6f33047015a47b8683d36912a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP FOREIGN KEY \`FK_b77d1fdfb326bb51ef9bdc04a2b\``,
    );
    await queryRunner.query(`DROP TABLE \`M_COURSE_TRIP_RELATIONSHIP\``);
  }
}

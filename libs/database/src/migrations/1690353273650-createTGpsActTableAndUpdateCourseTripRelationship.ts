import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTGpsActTableAndUpdateCourseTripRelationship1690353273650
  implements MigrationInterface
{
  name = 'CreateTGpsActTableAndUpdateCourseTripRelationship1690353273650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`T_GPT_ACT\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`GPS_ACT_KEY\` varchar(30) NOT NULL COMMENT '位置情報実績キー', \`COURSE_SEQ_NO\` int NOT NULL COMMENT 'コースシーケンスNo.', \`LATITUDE\` decimal(17,14) NOT NULL COMMENT '緯度', \`LONGITUDE\` decimal(17,14) NOT NULL COMMENT '経度', \`DISTANCE\` int NOT NULL COMMENT '移動距離', PRIMARY KEY (\`GPS_ACT_KEY\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` ADD \`COURSE_TRIP_ID\` int NOT NULL COMMENT 'コーストリップ紐づけID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP FOREIGN KEY \`FK_b77d1fdfb326bb51ef9bdc04a2b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP PRIMARY KEY, ADD PRIMARY KEY (\`COURSE_TRIP_ID\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` CHANGE \`COURSE_TRIP_ID\` \`COURSE_TRIP_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'コーストリップ紐づけID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` ADD CONSTRAINT \`FK_b77d1fdfb326bb51ef9bdc04a2b\` FOREIGN KEY (\`COURSE_ID\`) REFERENCES \`M_COURSE\`(\`COURSE_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_GPT_ACT\` ADD CONSTRAINT \`FK_d1af89884550503679981fb8417\` FOREIGN KEY (\`COURSE_SEQ_NO\`) REFERENCES \`T_COURSE\`(\`COURSE_SEQ_NO\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`T_GPT_ACT\` DROP FOREIGN KEY \`FK_d1af89884550503679981fb8417\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP FOREIGN KEY \`FK_b77d1fdfb326bb51ef9bdc04a2b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` CHANGE \`COURSE_TRIP_ID\` \`COURSE_TRIP_ID\` int NOT NULL COMMENT 'コーストリップ紐づけID'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP PRIMARY KEY, ADD PRIMARY KEY (\`COURSE_ID\`, \`COURSE_TRIP_ID\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` ADD CONSTRAINT \`FK_b77d1fdfb326bb51ef9bdc04a2b\` FOREIGN KEY (\`COURSE_ID\`) REFERENCES \`M_COURSE\`(\`COURSE_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE_TRIP_RELATIONSHIP\` DROP COLUMN \`COURSE_TRIP_ID\``,
    );
    await queryRunner.query(`DROP TABLE \`T_GPT_ACT\``);
  }
}

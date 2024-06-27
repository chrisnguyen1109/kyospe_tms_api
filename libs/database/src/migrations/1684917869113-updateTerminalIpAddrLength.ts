import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTerminalIpAddrLength1684917869113
  implements MigrationInterface
{
  name = 'UpdateTerminalIpAddrLength1684917869113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` CHANGE \`BASE_DIV\` \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_417faeaaa6b457858891976c272\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`CARRIAGE_BASE_ID\` \`CARRIAGE_BASE_ID\` int NULL COMMENT '庸車拠点ID:庸車の場合、業者がセンターに紐づいている。
同じ会社が複数のセンターに紐づく場合もある。'`);
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_417faeaaa6b457858891976c272\` FOREIGN KEY (\`CARRIAGE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_417faeaaa6b457858891976c272\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DIV_VALUE\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_CAR\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`CARRIAGE_BASE_ID\` \`CARRIAGE_BASE_ID\` int NULL COMMENT '庸車拠点ID:庸車の場合、業者がセンターに紐づいている。
同じ会社が複数のセンターに紐づく場合もある。'`);
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_417faeaaa6b457858891976c272\` FOREIGN KEY (\`CARRIAGE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_DRIVER\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` CHANGE \`BASE_DIV\` \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP COLUMN \`UPD_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`UPD_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '更新端末IPアドレス'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` DROP COLUMN \`REGI_TERMINAL_IP_ADDR\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_USER\` ADD \`REGI_TERMINAL_IP_ADDR\` varchar(15) NULL COMMENT '登録端末IPアドレス'`,
    );
  }
}

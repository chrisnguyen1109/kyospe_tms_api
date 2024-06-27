import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRestMasterTables1686729866326 implements MigrationInterface {
  name = 'CreateRestMasterTables1686729866326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`T_SLIP_DEADLINE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`SLIP_NO\` varchar(11) NOT NULL COMMENT '伝票No.', \`GYO_NO\` int NOT NULL COMMENT '行No.', \`DEADLINE_NO\` int NOT NULL COMMENT '納期行No', \`NUMBER_OF_CASES\` decimal(10,2) NULL COMMENT 'ケース数量', \`NUMBER_OF_ITEMS\` varchar(4) NULL COMMENT 'バラ数量', \`TOTAL_NUMBER\` decimal(10,2) NULL COMMENT '総バラ数量', \`DEADLINE\` date NULL COMMENT '納期日', \`DELETE_AT\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`SLIP_NO\`, \`GYO_NO\`, \`DEADLINE_NO\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`T_SLIP_DETAIL\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`SLIP_NO\` varchar(11) NOT NULL COMMENT '伝票No.', \`GYO_NO\` int NOT NULL COMMENT '行No.', \`PRODUCT_NM\` varchar(128) NULL COMMENT '商品名称', \`SIZE\` varchar(128) NULL COMMENT 'サイズ', \`QUANTITY_PER_CASE\` int NULL COMMENT '入数', \`NUMBER_OF_CASES\` decimal(10,2) NULL COMMENT 'ケース数量', \`UNIT_PER_CASE\` varchar(4) NULL COMMENT 'ケース単位', \`NUMBER_OF_ITEMS\` decimal(10,2) NULL COMMENT 'バラ数量', \`UNIT_PER_ITEM\` varchar(4) NULL COMMENT 'バラ単位', \`TOTAL_NUMBER\` decimal(10,2) NULL COMMENT '総バラ数量', \`SLIP_NO_FOR_PURCHASE_ORDER\` varchar(11) NULL COMMENT '発注に対する受注伝票No.', \`SEQ_NO_FOR_PURCHASE_ORDER\` int NULL COMMENT '発注に対する受注SeqNo.', \`GYO_NO_FOR_PURCHASE_ORDER\` int NULL COMMENT '発注に対する受注行No.', \`REMARKS\` text NULL COMMENT '備考', \`DELETE_AT\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`SLIP_NO\`, \`GYO_NO\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`CREATE TABLE \`T_SLIP_HEADER\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`SLIP_NO\` varchar(11) NOT NULL COMMENT '伝票No.', \`SEQ_NO\` int NULL COMMENT 'SeqNo', \`SLIP_STATUS_DIV\` enum ('01', '02', '03', '04') NULL COMMENT '配送状況区分', \`DELIVERY_DIV\` enum ('01', '02', '03') NULL COMMENT '配送区分;配送、引取、直送', \`SUPPLIER_CD\` varchar(7) NULL COMMENT '仕入先コード', \`PROCUREMENT_OFFICER_NM\` varchar(128) NULL COMMENT '仕入担当者名称', \`SALES_OFFICE\` varchar(128) NULL COMMENT '営業所', \`SALES_REPRESENTATIVE_NM\` varchar(128) NULL COMMENT '営業担当者名称', \`INPUT_STAFF_NM\` varchar(128) NULL COMMENT '入力担当者名称', \`TRANSFER_STAFF_NM\` varchar(128) NULL COMMENT '移動担当者名称', \`SHIPPING_DATE\` date NULL COMMENT '出荷日付', \`RECEIVING_DATE\` date NULL COMMENT '納期・移動入荷日付', \`RECEIVING_WAREHOUSE_CD\` varchar(7) NULL COMMENT '入荷倉庫コード', \`SHIPPING_WAREHOUSE_CD\` varchar(7) NULL COMMENT '出荷倉庫コード', \`SOURCE_WAREHOUSE_CD\` varchar(7) NULL COMMENT '移動元倉庫コード', \`DESTINATION_WAREHOUSE_CD\` varchar(7) NULL COMMENT '移動先倉庫コード', \`CUSTOMER_CD\` varchar(7) NULL COMMENT '得意先コード', \`CUSTOMER_BRANCH_NUMBER\` varchar(4) NULL COMMENT '得意先枝番', \`SITE_CD\` varchar(20) NULL COMMENT '現場コード;現場納品の場合はこちらにデータが入り、
現場納品でない場合は納品先にデータが入る認識', \`DELIVERY_DESTINATION_CD\` varchar(7) NULL COMMENT '納品先コード', \`DELIVERY_DESTINATION_BRANCH_NUM\` varchar(4) NULL COMMENT '納品先枝番', \`FACTORY_WAREHOUSE_CD\` varchar(7) NULL COMMENT '工場倉庫コード;自社製品の製造元', \`SLIP_NO_FOR_PURCHASE_ORDER\` varchar(11) NULL COMMENT '発注に対する受注伝票No.', \`SEQ_NO_FOR_PURCHASE_ORDER\` int NULL COMMENT '発注に対する受注SeqNo.', \`PICKUP_INFORMATION\` text NULL COMMENT '引取情報', \`CARRIER_ID\` int NULL COMMENT '運送会社ID', \`CARRIER_NM\` varchar(128) NULL COMMENT '運送会社名称', \`REMARKS\` text NULL COMMENT '備考', \`RETURN_MEMO\` text NULL COMMENT '持ち戻りメモ', \`ASSIGN_MEMO\` text NULL COMMENT '配車コメント', \`IMAGE_1\` text NULL COMMENT '画像１', \`IMAGE_2\` text NULL COMMENT '画像２', \`IMAGE_3\` text NULL COMMENT '画像３', \`IMAGE_4\` text NULL COMMENT '画像４', \`IMAGE_5\` text NULL COMMENT '画像５', \`ELECTRONIC_SIGNATURE_IMAGE\` text NULL COMMENT '電子サイン画像', \`DELETE_AT\` datetime(6) NULL COMMENT '削除日時', \`FIXED_FLG\` tinyint NOT NULL COMMENT '確定フラグ' DEFAULT 0, UNIQUE INDEX \`REL_a87753d706a38093d5848ffd15\` (\`SLIP_NO_FOR_PURCHASE_ORDER\`), PRIMARY KEY (\`SLIP_NO\`)) ENGINE=InnoDB`);
    await queryRunner.query(`CREATE TABLE \`T_SPOT\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`SPOT_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'スポットID', \`STATUS_DIV\` enum ('01', '02', '03') NULL COMMENT 'ステータス', \`SPOT_DIV\` enum ('01', '02', '03', '04') NULL COMMENT 'スポット区分;01：出荷倉庫
02：入荷倉庫
03：納品先現場
11：仕入先', \`BASE_ID\` int NULL COMMENT '拠点ID', \`BASE_NM\` varchar(128) NULL COMMENT '拠点名称', \`LATITUDE\` decimal(17,14) NULL COMMENT '緯度', \`LONGITUDE\` decimal(17,14) NULL COMMENT '経度', \`TEL_NUMBER\` varchar(13) NULL COMMENT '電話番号', \`POST_CD\` char(7) NULL COMMENT '郵便番号', \`ADDRESS_1\` varchar(256) NULL COMMENT '住所1', \`ADDRESS_2\` varchar(256) NULL COMMENT '住所2', \`ADDRESS_3\` varchar(256) NULL COMMENT '住所3', \`ORDER\` int NULL COMMENT '順番', \`WORK_END_TIME\` time NULL COMMENT '作業終了時間;終了時間のみ実績値', \`WORK_KINDS_DIV\` enum ('01', '02') NULL COMMENT '作業種別区分;積込、荷降ろし　など
区分より、テキストが良いかも？', \`WORK_MEMO\` text NULL COMMENT '作業メモ', \`TRIP_ID\` int NOT NULL COMMENT 'トリップID', PRIMARY KEY (\`SPOT_ID\`)) ENGINE=InnoDB`);
    await queryRunner.query(
      `CREATE TABLE \`T_TRIP\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`TRIP_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'トリップID', \`SLIP_NO\` varchar(11) NOT NULL COMMENT '伝票No.', \`COURSE_SEQ_NO\` int NULL COMMENT 'コースシーケンスNo.', \`SERVICE_YMD\` date NULL COMMENT '運行日付', \`START_BASE_ID\` int NULL COMMENT '出発拠点ID', \`ARRIVE_BASE_ID\` int NULL COMMENT '到着拠点ID', \`DELETE_AT\` datetime(6) NULL COMMENT '削除日時', PRIMARY KEY (\`TRIP_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`T_HIGHWAY_FEE_RECEIPT_IMAGE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`IMAGE_NO\` int NOT NULL AUTO_INCREMENT COMMENT '領収書画像No', \`HIGHWAY_FEE_NO\` int NOT NULL COMMENT '高速利用料金No.', \`RECEIPT_IMAGE\` text NULL COMMENT '領収書画像', PRIMARY KEY (\`IMAGE_NO\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`T_HIGHWAY_FEE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`HIGHWAY_FEE_NO\` int NOT NULL AUTO_INCREMENT COMMENT '高速利用料金No.', \`COURSE_SEQ_NO\` int NOT NULL COMMENT 'コースシーケンスNo.', \`PAYMENT_METHOD_DIV\` enum ('01', '02', '03', '04', '05', '06') NULL COMMENT '支払方法区分', \`AMOUNT\` decimal(10,0) NULL COMMENT '金額', PRIMARY KEY (\`HIGHWAY_FEE_NO\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`T_COURSE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`COURSE_SEQ_NO\` int NOT NULL AUTO_INCREMENT COMMENT 'コースシーケンスNo.', \`COURSE_ID\` int NULL COMMENT 'コース枠ID', \`DISPATCH_STATUS_DIV\` enum ('01', '02') NULL COMMENT '配車状況区分', \`DELIVERY_STATUS_DIV\` enum ('01', '02', '03') NULL COMMENT '配送状況区分', \`SERVICE_YMD\` date NULL COMMENT '運行日付', \`START_TIME\` time NULL COMMENT '開始予定時間', \`END_TIME\` time NULL COMMENT '終了予定時間', \`START_BASE_ID\` int NULL COMMENT '出発拠点ID', \`ARRIVE_BASE_ID\` int NULL COMMENT '到着拠点ID', \`TRANSPORT_COMPANY_ID\` int NULL COMMENT '運送会社ID', \`CAR_ID\` int NULL COMMENT '車両ID', \`DRIVER_ID\` int NULL COMMENT '配送員ID', \`ACTUAL_START_TIME\` time NULL COMMENT '実績_開始時間', \`ACTUAL_END_TIME\` time NULL COMMENT '実績_終了時間', \`TRANSIT_DISTANCE\` int NULL COMMENT '移動距離;m単位', \`SIGNBOARD_PHOTO_1\` text NULL COMMENT '看板写真1', \`SIGNBOARD_PHOTO_2\` text NULL COMMENT '看板写真2', \`SIGNBOARD_PHOTO_3\` text NULL COMMENT '看板写真3', \`SIGNBOARD_PHOTO_4\` text NULL COMMENT '看板写真4', \`SIGNBOARD_PHOTO_5\` text NULL COMMENT '看板写真5', \`SIGNBOARD_PHOTO_6\` text NULL COMMENT '看板写真6', PRIMARY KEY (\`COURSE_SEQ_NO\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`M_COURSE\` (\`REGI_PG_ID\` varchar(50) NULL COMMENT '登録プログラムID', \`REGI_DATETIME\` datetime(6) NULL COMMENT '登録日時' DEFAULT CURRENT_TIMESTAMP(6), \`REGI_USER_ID\` int NULL COMMENT '登録ユーザID', \`REGI_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '登録端末IPアドレス', \`UPD_PG_ID\` varchar(50) NULL COMMENT '更新プログラム', \`UPD_DATETIME\` datetime(6) NULL COMMENT '更新日時' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`UPD_USER_ID\` int NULL COMMENT '更新ユーザID', \`UPD_TERMINAL_IP_ADDR\` varchar(45) NULL COMMENT '更新端末IPアドレス', \`COURSE_ID\` int NOT NULL AUTO_INCREMENT COMMENT 'コース枠ID', \`COURSE_NM\` varchar(128) NULL COMMENT 'コース名称', \`SERVICE_START_TIME\` time NULL COMMENT '運行開始時間', \`SERVICE_END_TIME\` time NULL COMMENT '運行終了時間', \`TRANSPORT_COMPANY_ID\` int NULL COMMENT '運送会社ID', \`START_BASE_ID\` int NULL COMMENT '出発拠点ID', \`ARRIVE_BASE_ID\` int NULL COMMENT '到着拠点ID', PRIMARY KEY (\`COURSE_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_417faeaaa6b457858891976c272\``,
    );
    await queryRunner.query(`ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`CARRIAGE_BASE_ID\` \`CARRIAGE_BASE_ID\` int NULL COMMENT '庸車拠点ID:庸車の場合、業者がセンターに紐づいている。
同じ会社が複数のセンターに紐づく場合もある。'`);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` ADD UNIQUE INDEX \`IDX_4e63611f3c13264e9e49e2da5b\` (\`BASE_CD\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` CHANGE \`BASE_DIV\` \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_417fdf66a9f0c77f2e6c0af520\` ON \`M_BASE\` (\`BASE_CD\`, \`BASE_EDA\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` ADD CONSTRAINT \`FK_6c1158b531ce1ef062f4cbeacc8\` FOREIGN KEY (\`SLIP_NO\`, \`GYO_NO\`) REFERENCES \`T_SLIP_DETAIL\`(\`SLIP_NO\`,\`GYO_NO\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DETAIL\` ADD CONSTRAINT \`FK_17e02226b9d72159e3eb7f717da\` FOREIGN KEY (\`SLIP_NO\`) REFERENCES \`T_SLIP_HEADER\`(\`SLIP_NO\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` ADD CONSTRAINT \`FK_a87753d706a38093d5848ffd15a\` FOREIGN KEY (\`SLIP_NO_FOR_PURCHASE_ORDER\`) REFERENCES \`T_SLIP_HEADER\`(\`SLIP_NO\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` ADD CONSTRAINT \`FK_33f64a0a976473fdc882237a903\` FOREIGN KEY (\`BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` ADD CONSTRAINT \`FK_54f9126e637610ce0cc21186d39\` FOREIGN KEY (\`TRIP_ID\`) REFERENCES \`T_TRIP\`(\`TRIP_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` ADD CONSTRAINT \`FK_9ad5859482e714d905a0d569b65\` FOREIGN KEY (\`SLIP_NO\`) REFERENCES \`T_SLIP_HEADER\`(\`SLIP_NO\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` ADD CONSTRAINT \`FK_7885b77da600b35589196b53610\` FOREIGN KEY (\`COURSE_SEQ_NO\`) REFERENCES \`T_COURSE\`(\`COURSE_SEQ_NO\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` ADD CONSTRAINT \`FK_8149be69fa1b4335daaa6588c94\` FOREIGN KEY (\`START_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` ADD CONSTRAINT \`FK_2b7074a530c5d445fe7cb4f53fb\` FOREIGN KEY (\`ARRIVE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE_RECEIPT_IMAGE\` ADD CONSTRAINT \`FK_558c6734254ceca39a903c192ad\` FOREIGN KEY (\`HIGHWAY_FEE_NO\`) REFERENCES \`T_HIGHWAY_FEE\`(\`HIGHWAY_FEE_NO\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE\` ADD CONSTRAINT \`FK_9dcfc2c5f51650bc0f35a7fc53e\` FOREIGN KEY (\`COURSE_SEQ_NO\`) REFERENCES \`T_COURSE\`(\`COURSE_SEQ_NO\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD CONSTRAINT \`FK_9bddb3520b4e069b902b450987c\` FOREIGN KEY (\`COURSE_ID\`) REFERENCES \`M_COURSE\`(\`COURSE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD CONSTRAINT \`FK_d1618e013be55dcf73d2ed547e8\` FOREIGN KEY (\`START_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD CONSTRAINT \`FK_8016ba6e841aeebeafe4a9188fc\` FOREIGN KEY (\`ARRIVE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD CONSTRAINT \`FK_ebea0b60541efbe439203f2695f\` FOREIGN KEY (\`TRANSPORT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD CONSTRAINT \`FK_a87b037626f69457a76cdcbc165\` FOREIGN KEY (\`CAR_ID\`) REFERENCES \`M_CAR\`(\`CAR_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` ADD CONSTRAINT \`FK_b510281a01cacbe1fee5d2273bb\` FOREIGN KEY (\`DRIVER_ID\`) REFERENCES \`M_DRIVER\`(\`DRIVER_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_417faeaaa6b457858891976c272\` FOREIGN KEY (\`CARRIAGE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` ADD CONSTRAINT \`FK_7304206a065f5510401ae9c4c9d\` FOREIGN KEY (\`TRANSPORT_COMPANY_ID\`) REFERENCES \`M_TRANSPORT_COMPANY\`(\`TRANSPORT_COMPANY_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` ADD CONSTRAINT \`FK_a3d0a4dc509c7e8c71c2ec26713\` FOREIGN KEY (\`START_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` ADD CONSTRAINT \`FK_4dccf3b3f184dad6c917535eccd\` FOREIGN KEY (\`ARRIVE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` DROP FOREIGN KEY \`FK_4dccf3b3f184dad6c917535eccd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` DROP FOREIGN KEY \`FK_a3d0a4dc509c7e8c71c2ec26713\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_COURSE\` DROP FOREIGN KEY \`FK_7304206a065f5510401ae9c4c9d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` DROP FOREIGN KEY \`FK_417faeaaa6b457858891976c272\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP FOREIGN KEY \`FK_b510281a01cacbe1fee5d2273bb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP FOREIGN KEY \`FK_a87b037626f69457a76cdcbc165\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP FOREIGN KEY \`FK_ebea0b60541efbe439203f2695f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP FOREIGN KEY \`FK_8016ba6e841aeebeafe4a9188fc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP FOREIGN KEY \`FK_d1618e013be55dcf73d2ed547e8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_COURSE\` DROP FOREIGN KEY \`FK_9bddb3520b4e069b902b450987c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE\` DROP FOREIGN KEY \`FK_9dcfc2c5f51650bc0f35a7fc53e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_HIGHWAY_FEE_RECEIPT_IMAGE\` DROP FOREIGN KEY \`FK_558c6734254ceca39a903c192ad\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` DROP FOREIGN KEY \`FK_2b7074a530c5d445fe7cb4f53fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` DROP FOREIGN KEY \`FK_8149be69fa1b4335daaa6588c94\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` DROP FOREIGN KEY \`FK_7885b77da600b35589196b53610\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_TRIP\` DROP FOREIGN KEY \`FK_9ad5859482e714d905a0d569b65\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` DROP FOREIGN KEY \`FK_54f9126e637610ce0cc21186d39\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SPOT\` DROP FOREIGN KEY \`FK_33f64a0a976473fdc882237a903\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_HEADER\` DROP FOREIGN KEY \`FK_a87753d706a38093d5848ffd15a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DETAIL\` DROP FOREIGN KEY \`FK_17e02226b9d72159e3eb7f717da\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`T_SLIP_DEADLINE\` DROP FOREIGN KEY \`FK_6c1158b531ce1ef062f4cbeacc8\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_417fdf66a9f0c77f2e6c0af520\` ON \`M_BASE\``,
    );
    await queryRunner.query(`ALTER TABLE \`M_BASE\` CHANGE \`BASE_DIV\` \`BASE_DIV\` enum ('01', '02', '03', '04', '05') NOT NULL COMMENT '拠点区分:01：倉庫
02：現場
03：得意先
04：納品先
05：仕入先'`);
    await queryRunner.query(
      `ALTER TABLE \`M_BASE\` DROP INDEX \`IDX_4e63611f3c13264e9e49e2da5b\``,
    );
    await queryRunner.query(`ALTER TABLE \`M_TRANSPORT_COMPANY\` CHANGE \`CARRIAGE_BASE_ID\` \`CARRIAGE_BASE_ID\` int NULL COMMENT '庸車拠点ID:庸車の場合、業者がセンターに紐づいている。
同じ会社が複数のセンターに紐づく場合もある。'`);
    await queryRunner.query(
      `ALTER TABLE \`M_TRANSPORT_COMPANY\` ADD CONSTRAINT \`FK_417faeaaa6b457858891976c272\` FOREIGN KEY (\`CARRIAGE_BASE_ID\`) REFERENCES \`M_BASE\`(\`BASE_ID\`) ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(`DROP TABLE \`M_COURSE\``);
    await queryRunner.query(`DROP TABLE \`T_COURSE\``);
    await queryRunner.query(`DROP TABLE \`T_HIGHWAY_FEE\``);
    await queryRunner.query(`DROP TABLE \`T_HIGHWAY_FEE_RECEIPT_IMAGE\``);
    await queryRunner.query(`DROP TABLE \`T_TRIP\``);
    await queryRunner.query(`DROP TABLE \`T_SPOT\``);
    await queryRunner.query(
      `DROP INDEX \`REL_a87753d706a38093d5848ffd15\` ON \`T_SLIP_HEADER\``,
    );
    await queryRunner.query(`DROP TABLE \`T_SLIP_HEADER\``);
    await queryRunner.query(`DROP TABLE \`T_SLIP_DETAIL\``);
    await queryRunner.query(`DROP TABLE \`T_SLIP_DEADLINE\``);
  }
}

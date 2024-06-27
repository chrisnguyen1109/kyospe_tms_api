import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourceMemo1704789035807 implements MigrationInterface {
    name = 'AddCourceMemo1704789035807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`T_COURSE\` ADD \`MEMO\` text NULL COMMENT '備考'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`T_COURSE\` DROP COLUMN \`MEMO\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm"

export class AddCourseDeleteAt1710034191632 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`T_COURSE\` ADD \`DELETE_AT\` datetime NULL COMMENT '削除日時'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`T_COURSE\` DROP COLUMN \`DELETE_AT\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm"

export class AddsortOrderToBaseTable1698928860897 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`M_BASE\` ADD \`SORT_ORDER\` integer NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`M_BASE\` DROP COLUMN \`SORT_ORDER\``);
    }

}

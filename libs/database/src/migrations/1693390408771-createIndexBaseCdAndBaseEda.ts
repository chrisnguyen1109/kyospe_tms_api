import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIndexBaseCdAndBaseEda1693390408771 implements MigrationInterface {
    name = 'CreateIndexBaseCdAndBaseEda1693390408771'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_417fdf66a9f0c77f2e6c0af520\` ON \`M_BASE\` (\`BASE_CD\`, \`BASE_EDA\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_417fdf66a9f0c77f2e6c0af520\` ON \`M_BASE\``);
    }

}

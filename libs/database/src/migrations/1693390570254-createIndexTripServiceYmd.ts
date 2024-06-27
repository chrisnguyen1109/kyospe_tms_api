import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIndexTripServiceYmd1693390570254 implements MigrationInterface {
    name = 'CreateIndexTripServiceYmd1693390570254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_efa846a593475833fe3f7b6981\` ON \`T_TRIP\` (\`SERVICE_YMD\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_efa846a593475833fe3f7b6981\` ON \`T_TRIP\``);
    }

}

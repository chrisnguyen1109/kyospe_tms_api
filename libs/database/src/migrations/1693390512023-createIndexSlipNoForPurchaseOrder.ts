import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIndexSlipNoForPurchaseOrder1693390512023 implements MigrationInterface {
    name = 'CreateIndexSlipNoForPurchaseOrder1693390512023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX \`IDX_a87753d706a38093d5848ffd15\` ON \`T_SLIP_HEADER\` (\`SLIP_NO_FOR_PURCHASE_ORDER\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_a87753d706a38093d5848ffd15\` ON \`T_SLIP_HEADER\``);
    }

}

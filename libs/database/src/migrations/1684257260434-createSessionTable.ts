import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionTable1684257260434 implements MigrationInterface {
  name = 'CreateSessionTable1684257260434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`SESSION\` (\`M_USER_ID\` int NOT NULL, \`SESSION_ID\` varchar(255) NOT NULL, \`JWT_ID\` varchar(255) NOT NULL, PRIMARY KEY (\`M_USER_ID\`, \`SESSION_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`SESSION\` ADD CONSTRAINT \`FK_7ab6753114b966b11e956631f7b\` FOREIGN KEY (\`M_USER_ID\`) REFERENCES \`M_USER\`(\`M_USER_ID\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`SESSION\` DROP FOREIGN KEY \`FK_7ab6753114b966b11e956631f7b\``,
    );
    await queryRunner.query(`DROP TABLE \`SESSION\``);
  }
}

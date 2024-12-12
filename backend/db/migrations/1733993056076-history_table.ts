import { MigrationInterface, QueryRunner } from "typeorm";

export class HistoryTable1733993056076 implements MigrationInterface {
    name = 'HistoryTable1733993056076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`history\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`videoId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_2e0e4f9bccf8430a3e67d554e79\` FOREIGN KEY (\`videoId\`) REFERENCES \`video\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`history\` ADD CONSTRAINT \`FK_7d339708f0fa8446e3c4128dea9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_7d339708f0fa8446e3c4128dea9\``);
        await queryRunner.query(`ALTER TABLE \`history\` DROP FOREIGN KEY \`FK_2e0e4f9bccf8430a3e67d554e79\``);
        await queryRunner.query(`DROP TABLE \`history\``);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDefaultStatusVideo1730227554932 implements MigrationInterface {
    name = 'EditDefaultStatusVideo1730227554932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'confirming'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`status\` int NOT NULL DEFAULT '1'`);
    }

}

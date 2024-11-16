import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdIntoVideoDetails1731704194011 implements MigrationInterface {
    name = 'AddUserIdIntoVideoDetails1731704194011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD CONSTRAINT \`FK_3b66d77920e7c9d05788b5753df\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP FOREIGN KEY \`FK_3b66d77920e7c9d05788b5753df\``);
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP COLUMN \`userId\``);
    }

}

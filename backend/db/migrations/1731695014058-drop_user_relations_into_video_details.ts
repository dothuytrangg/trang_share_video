import { MigrationInterface, QueryRunner } from "typeorm";

export class DropUserRelationsIntoVideoDetails1731695014058 implements MigrationInterface {
    name = 'DropUserRelationsIntoVideoDetails1731695014058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`video_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`videoId\` int NULL, \`categoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD CONSTRAINT \`FK_597e1771b552066ee11a17cb5ea\` FOREIGN KEY (\`videoId\`) REFERENCES \`video\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD CONSTRAINT \`FK_2109c11a56ae0ba7689bee75809\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP FOREIGN KEY \`FK_2109c11a56ae0ba7689bee75809\``);
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP FOREIGN KEY \`FK_597e1771b552066ee11a17cb5ea\``);
        await queryRunner.query(`DROP TABLE \`video_detail\``);
    }

}

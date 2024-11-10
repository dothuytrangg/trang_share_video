import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVideosTable1729693481364 implements MigrationInterface {
    name = 'CreateVideosTable1729693481364'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`video\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`timeout\` int NULL, \`url\` varchar(255) NULL, \`likes\` int NULL, \`dislike\` int NULL, \`viewed\` int NULL, \`slug\` varchar(255) NULL, \`position\` int NOT NULL DEFAULT '10', \`is_hot\` tinyint NOT NULL DEFAULT 0, \`thumbnail\` varchar(255) NOT NULL DEFAULT 'thumbnail_url', \`status\` int NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`category\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`category\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`video\` ADD CONSTRAINT \`FK_550d619ef9610080a3f9e175edf\` FOREIGN KEY (\`userIdId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` DROP FOREIGN KEY \`FK_550d619ef9610080a3f9e175edf\``);
        await queryRunner.query(`ALTER TABLE \`category\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`category\` CHANGE \`description\` \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`video\``);
    }

}

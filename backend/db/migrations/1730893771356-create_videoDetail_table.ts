import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVideoDetailTable1730893771356 implements MigrationInterface {
    name = 'CreateVideoDetailTable1730893771356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`video_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`videoId\` int NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_597e1771b552066ee11a17cb5e\` (\`videoId\`), UNIQUE INDEX \`REL_3b66d77920e7c9d05788b5753d\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD CONSTRAINT \`FK_597e1771b552066ee11a17cb5ea\` FOREIGN KEY (\`videoId\`) REFERENCES \`video\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD CONSTRAINT \`FK_3b66d77920e7c9d05788b5753df\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP FOREIGN KEY \`FK_3b66d77920e7c9d05788b5753df\``);
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP FOREIGN KEY \`FK_597e1771b552066ee11a17cb5ea\``);
        await queryRunner.query(`DROP INDEX \`REL_3b66d77920e7c9d05788b5753d\` ON \`video_detail\``);
        await queryRunner.query(`DROP INDEX \`REL_597e1771b552066ee11a17cb5e\` ON \`video_detail\``);
        await queryRunner.query(`DROP TABLE \`video_detail\``);
    }

}

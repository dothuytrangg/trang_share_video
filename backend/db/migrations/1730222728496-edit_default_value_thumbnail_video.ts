import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDefaultValueThumbnailVideo1730222728496 implements MigrationInterface {
    name = 'EditDefaultValueThumbnailVideo1730222728496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`thumbnail\` \`thumbnail\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`thumbnail\` \`thumbnail\` varchar(255) NOT NULL DEFAULT 'thumbnail_url'`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVideoDetailTableAddCategoryId1730894346878 implements MigrationInterface {
    name = 'CreateVideoDetailTableAddCategoryId1730894346878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`video_detail\` ADD CONSTRAINT \`FK_2109c11a56ae0ba7689bee75809\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP FOREIGN KEY \`FK_2109c11a56ae0ba7689bee75809\``);
        await queryRunner.query(`ALTER TABLE \`video_detail\` DROP COLUMN \`categoryId\``);
    }

}

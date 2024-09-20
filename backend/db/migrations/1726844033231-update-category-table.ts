import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategoryTable1726844033231 implements MigrationInterface {
    name = 'UpdateCategoryTable1726844033231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` CHANGE \`slug\` \`slug\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`category\` CHANGE \`slug\` \`slug\` varchar(255) NOT NULL`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class EditRelationsVideoDetailTable1731689920211 implements MigrationInterface {
    name = 'EditRelationsVideoDetailTable1731689920211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`status\` \`status\` varchar(255) NULL DEFAULT 'confirming'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`status\` \`status\` varchar(255) NOT NULL DEFAULT 'confirming'`);
    }

}

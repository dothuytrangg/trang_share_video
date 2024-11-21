import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDefaultVideo1732182404689 implements MigrationInterface {
    name = 'EditDefaultVideo1732182404689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`likes\` \`likes\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`dislike\` \`dislike\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`viewed\` \`viewed\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`viewed\` \`viewed\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`dislike\` \`dislike\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`likes\` \`likes\` int NULL DEFAULT '0'`);
    }

}

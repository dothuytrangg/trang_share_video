import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDb1731608054795 implements MigrationInterface {
    name = 'EditDb1731608054795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`emailVerifiedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`statusVerify\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`statusVerify\` varchar(255) NOT NULL DEFAULT 'inactive'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`emailVerifiedAt\` datetime NULL`);
    }

}

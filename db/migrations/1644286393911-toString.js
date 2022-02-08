const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class toString1644286393911 {
    name = 'toString1644286393911'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "average_price"`);
        await queryRunner.query(`ALTER TABLE "series" ADD "average_price" text`);
        await queryRunner.query(`ALTER TABLE "spotlight" DROP COLUMN "average"`);
        await queryRunner.query(`ALTER TABLE "spotlight" ADD "average" text`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "spotlight" DROP COLUMN "average"`);
        await queryRunner.query(`ALTER TABLE "spotlight" ADD "average" numeric`);
        await queryRunner.query(`ALTER TABLE "series" DROP COLUMN "average_price"`);
        await queryRunner.query(`ALTER TABLE "series" ADD "average_price" numeric`);
    }
}

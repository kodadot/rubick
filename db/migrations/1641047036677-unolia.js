const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class unolia1641047036677 {
    name = 'unolia1641047036677'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "event" ADD "timestamp" numeric NOT NULL`);
    }
}

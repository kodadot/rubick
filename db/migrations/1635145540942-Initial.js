const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1635145540942 {
    name = 'Initial1635145540942'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "historical_balance" ("id" character varying NOT NULL, "balance" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "account_id" character varying NOT NULL, CONSTRAINT "PK_74ac29ad0bdffb6d1281a1e17e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_383ff006e4b59db91d32cb891e" ON "historical_balance" ("account_id") `);
        await queryRunner.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "wallet" text NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "historical_balance" ADD CONSTRAINT "FK_383ff006e4b59db91d32cb891e9" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "historical_balance" DROP CONSTRAINT "FK_383ff006e4b59db91d32cb891e9"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_383ff006e4b59db91d32cb891e"`);
        await queryRunner.query(`DROP TABLE "historical_balance"`);
    }
}

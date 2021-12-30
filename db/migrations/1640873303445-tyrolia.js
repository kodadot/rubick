const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class tyrolia1640873303445 {
    name = 'tyrolia1640873303445'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "event" ("id" character varying NOT NULL, "block_number" numeric, "timestamp" numeric NOT NULL, "caller" text NOT NULL, "interaction" character varying(12) NOT NULL, "meta" text NOT NULL, "nft_id" character varying NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9380d479563e5a664759359470" ON "event" ("nft_id") `);
        await queryRunner.query(`ALTER TABLE "nft_entity" DROP COLUMN "events"`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_9380d479563e5a664759359470a" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_9380d479563e5a664759359470a"`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ADD "events" jsonb`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9380d479563e5a664759359470"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }
}

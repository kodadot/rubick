const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1639147106950 {
    name = 'Initial1639147106950'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "remark_entity" ("id" character varying NOT NULL, "value" text NOT NULL, "caller" text NOT NULL, "block_number" text NOT NULL, "interaction" text, CONSTRAINT "PK_47fe6cc1a357ef713548bfb9c9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "failed_entity" ("id" character varying NOT NULL, "value" text NOT NULL, "reason" text NOT NULL, "interaction" text, CONSTRAINT "PK_df628d98d9ba1555d905ee20d6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "emote" ("id" character varying NOT NULL, "caller" text NOT NULL, "value" text NOT NULL, "nft_id" character varying NOT NULL, CONSTRAINT "PK_c08d432f6b22ef550be511163ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_463234b85d428ddde1bce27182" ON "emote" ("nft_id") `);
        await queryRunner.query(`CREATE TABLE "nft_entity" ("name" text, "instance" text, "transferable" integer, "issuer" text, "sn" text, "id" character varying NOT NULL, "metadata" text, "current_owner" text, "price" numeric, "burned" boolean, "block_number" numeric, "events" jsonb, "collection_id" character varying NOT NULL, CONSTRAINT "PK_ed09c6a38c0f0a867d5a7b63f0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4b98bf4d630de0037475b9bbb7" ON "nft_entity" ("collection_id") `);
        await queryRunner.query(`CREATE TABLE "collection_entity" ("version" text, "name" text, "max" integer, "issuer" text, "symbol" text, "id" character varying NOT NULL, "metadata" text, "current_owner" text, "events" jsonb, "block_number" numeric, CONSTRAINT "PK_5d44e140c4fcb3d961f9e83405f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "emote" ADD CONSTRAINT "FK_463234b85d428ddde1bce271829" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a" FOREIGN KEY ("collection_id") REFERENCES "collection_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a"`);
        await queryRunner.query(`ALTER TABLE "emote" DROP CONSTRAINT "FK_463234b85d428ddde1bce271829"`);
        await queryRunner.query(`DROP TABLE "collection_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4b98bf4d630de0037475b9bbb7"`);
        await queryRunner.query(`DROP TABLE "nft_entity"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_463234b85d428ddde1bce27182"`);
        await queryRunner.query(`DROP TABLE "emote"`);
        await queryRunner.query(`DROP TABLE "failed_entity"`);
        await queryRunner.query(`DROP TABLE "remark_entity"`);
    }
}

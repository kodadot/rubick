const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class yolia1640098187019 {
    name = 'yolia1640098187019'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "metadata_entity" ("id" character varying NOT NULL, "name" text, "description" text, "image" text, "attributes" jsonb, "animation_url" text, "type" text, CONSTRAINT "PK_2cb9d5d4ae99d9a27497bf8d2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ADD "meta_id" character varying`);
        await queryRunner.query(`ALTER TABLE "collection_entity" ADD "meta_id" character varying`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ALTER COLUMN "burned" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection_entity" ALTER COLUMN "max" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_2bfc45b91959a14ab8b2d734cd" ON "nft_entity" ("meta_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_014542183f297493eab0cd8bdf" ON "collection_entity" ("meta_id") `);
        await queryRunner.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_2bfc45b91959a14ab8b2d734cd2" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "collection_entity" ADD CONSTRAINT "FK_014542183f297493eab0cd8bdf8" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "collection_entity" DROP CONSTRAINT "FK_014542183f297493eab0cd8bdf8"`);
        await queryRunner.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_2bfc45b91959a14ab8b2d734cd2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_014542183f297493eab0cd8bdf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2bfc45b91959a14ab8b2d734cd"`);
        await queryRunner.query(`ALTER TABLE "collection_entity" ALTER COLUMN "max" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ALTER COLUMN "burned" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection_entity" DROP COLUMN "meta_id"`);
        await queryRunner.query(`ALTER TABLE "nft_entity" DROP COLUMN "meta_id"`);
        await queryRunner.query(`DROP TABLE "metadata_entity"`);
    }
}

module.exports = class Data1644569405683 {
  name = 'Data1644569405683'

  async up(db) {
    await db.query(`CREATE TABLE "remark_entity" ("id" character varying NOT NULL, "value" text NOT NULL, "caller" text NOT NULL, "block_number" text NOT NULL, "interaction" text, CONSTRAINT "PK_47fe6cc1a357ef713548bfb9c9c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "failed_entity" ("id" character varying NOT NULL, "value" text NOT NULL, "reason" text NOT NULL, "interaction" text, CONSTRAINT "PK_df628d98d9ba1555d905ee20d6b" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "event" ("id" character varying NOT NULL, "block_number" numeric, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "caller" text NOT NULL, "interaction" character varying(12) NOT NULL, "meta" text NOT NULL, "nft_id" character varying NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_9380d479563e5a664759359470" ON "event" ("nft_id") `)
    await db.query(`CREATE TABLE "emote" ("id" character varying NOT NULL, "caller" text NOT NULL, "value" text NOT NULL, "nft_id" character varying NOT NULL, CONSTRAINT "PK_c08d432f6b22ef550be511163ac" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_463234b85d428ddde1bce27182" ON "emote" ("nft_id") `)
    await db.query(`CREATE TABLE "metadata_entity" ("id" character varying NOT NULL, "name" text, "description" text, "image" text, "attributes" jsonb, "animation_url" text, "type" text, CONSTRAINT "PK_2cb9d5d4ae99d9a27497bf8d2e8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "nft_entity" ("name" text, "instance" text, "transferable" integer, "issuer" text, "sn" text, "id" character varying NOT NULL, "metadata" text, "current_owner" text, "price" numeric NOT NULL, "burned" boolean NOT NULL, "block_number" numeric, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "collection_id" character varying NOT NULL, "meta_id" character varying, CONSTRAINT "PK_ed09c6a38c0f0a867d5a7b63f0d" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_4b98bf4d630de0037475b9bbb7" ON "nft_entity" ("collection_id") `)
    await db.query(`CREATE INDEX "IDX_2bfc45b91959a14ab8b2d734cd" ON "nft_entity" ("meta_id") `)
    await db.query(`CREATE TABLE "collection_entity" ("version" text, "name" text, "max" integer NOT NULL, "issuer" text, "symbol" text, "id" character varying NOT NULL, "metadata" text, "current_owner1" text, "events" jsonb, "block_number" numeric, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "meta_id" character varying, CONSTRAINT "PK_5d44e140c4fcb3d961f9e83405f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_014542183f297493eab0cd8bdf" ON "collection_entity" ("meta_id") `)
    await db.query(`CREATE TABLE "series" ("id" character varying NOT NULL, "unique" integer NOT NULL, "unique_collectors" integer NOT NULL, "sold" integer NOT NULL, "total" integer NOT NULL, "average_price" text, "floor_price" numeric, "buys" integer, "volume" numeric, "name" text NOT NULL, "metadata" text, "image" text, CONSTRAINT "PK_e725676647382eb54540d7128ba" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "spotlight" ("id" character varying NOT NULL, "collections" integer NOT NULL, "unique_collectors" integer NOT NULL, "unique" integer NOT NULL, "sold" integer NOT NULL, "total" integer NOT NULL, "average" text, "volume" numeric, CONSTRAINT "PK_bafc41803e508da64ed687ed3b9" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "cache_status" ("id" character varying NOT NULL, "last_block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1001e39eb0aa38d043d96f7f4fa" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_9380d479563e5a664759359470a" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "emote" ADD CONSTRAINT "FK_463234b85d428ddde1bce271829" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a" FOREIGN KEY ("collection_id") REFERENCES "collection_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_2bfc45b91959a14ab8b2d734cd2" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "collection_entity" ADD CONSTRAINT "FK_014542183f297493eab0cd8bdf8" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "remark_entity"`)
    await db.query(`DROP TABLE "failed_entity"`)
    await db.query(`DROP TABLE "event"`)
    await db.query(`DROP INDEX "public"."IDX_9380d479563e5a664759359470"`)
    await db.query(`DROP TABLE "emote"`)
    await db.query(`DROP INDEX "public"."IDX_463234b85d428ddde1bce27182"`)
    await db.query(`DROP TABLE "metadata_entity"`)
    await db.query(`DROP TABLE "nft_entity"`)
    await db.query(`DROP INDEX "public"."IDX_4b98bf4d630de0037475b9bbb7"`)
    await db.query(`DROP INDEX "public"."IDX_2bfc45b91959a14ab8b2d734cd"`)
    await db.query(`DROP TABLE "collection_entity"`)
    await db.query(`DROP INDEX "public"."IDX_014542183f297493eab0cd8bdf"`)
    await db.query(`DROP TABLE "series"`)
    await db.query(`DROP TABLE "spotlight"`)
    await db.query(`DROP TABLE "cache_status"`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_9380d479563e5a664759359470a"`)
    await db.query(`ALTER TABLE "emote" DROP CONSTRAINT "FK_463234b85d428ddde1bce271829"`)
    await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a"`)
    await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_2bfc45b91959a14ab8b2d734cd2"`)
    await db.query(`ALTER TABLE "collection_entity" DROP CONSTRAINT "FK_014542183f297493eab0cd8bdf8"`)
  }
}

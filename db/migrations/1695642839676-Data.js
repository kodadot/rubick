module.exports = class Data1695642839676 {
    name = 'Data1695642839676'

    async up(db) {
        await db.query(`CREATE TABLE "token_entity" ("id" character varying NOT NULL, "block_number" numeric, "hash" text NOT NULL, "image" text, "media" text, "name" text, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "count" integer NOT NULL, "collection_id" character varying, CONSTRAINT "PK_687443f2a51af49b5472e2c5ddc" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0eb2ed7929c3e81941fa1b51b3" ON "token_entity" ("collection_id") `)
        await db.query(`CREATE INDEX "IDX_40d6049fd30532dada71922792" ON "token_entity" ("hash") `)
        await db.query(`CREATE INDEX "IDX_47b385945a425667b9e690bc02" ON "token_entity" ("name") `)
        await db.query(`ALTER TABLE "nft_entity" ADD "token_id" character varying`)
        await db.query(`CREATE INDEX "IDX_060d0f515d293fac1d81ee61a7" ON "nft_entity" ("token_id") `)
        await db.query(`ALTER TABLE "token_entity" ADD CONSTRAINT "FK_0eb2ed7929c3e81941fa1b51b35" FOREIGN KEY ("collection_id") REFERENCES "collection_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_060d0f515d293fac1d81ee61a79" FOREIGN KEY ("token_id") REFERENCES "token_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token_entity"`)
        await db.query(`DROP INDEX "public"."IDX_0eb2ed7929c3e81941fa1b51b3"`)
        await db.query(`DROP INDEX "public"."IDX_40d6049fd30532dada71922792"`)
        await db.query(`DROP INDEX "public"."IDX_47b385945a425667b9e690bc02"`)
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "token_id"`)
        await db.query(`DROP INDEX "public"."IDX_060d0f515d293fac1d81ee61a7"`)
        await db.query(`ALTER TABLE "token_entity" DROP CONSTRAINT "FK_0eb2ed7929c3e81941fa1b51b35"`)
        await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_060d0f515d293fac1d81ee61a79"`)
    }
}

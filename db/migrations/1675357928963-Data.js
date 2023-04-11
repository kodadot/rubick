module.exports = class Data1675357928963 {
    name = 'Data1675357928963'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_16e57ac8478b6ea1f383e3eb03"`)
        await db.query(`CREATE TABLE "base" ("id" character varying NOT NULL, "type" character varying(5) NOT NULL, "symbol" text NOT NULL, "issuer" text NOT NULL, "current_owner" text NOT NULL, "metadata" text, "meta_id" character varying, CONSTRAINT "PK_ee39d2f844e458c187af0e5383f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8169d5c032175073a2cb2dced2" ON "base" ("meta_id") `)
        await db.query(`ALTER TABLE "emote" ADD "version" text NOT NULL`)
        await db.query(`ALTER TABLE "event" ADD "version" text NOT NULL`)
        await db.query(`ALTER TABLE "nft_entity" ADD "version" text NOT NULL`)
        await db.query(`ALTER TABLE "collection_entity" ADD "hash" text NOT NULL`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "issuer" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "symbol" SET NOT NULL`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "version" SET NOT NULL`)
        await db.query(`CREATE UNIQUE INDEX "IDX_16e57ac8478b6ea1f383e3eb03" ON "nft_entity" ("hash") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_90561baea428b17fdaf8e484d7" ON "collection_entity" ("hash") `)
        await db.query(`CREATE UNIQUE INDEX "IDX_52aced6d11be2f40270941fe32" ON "collection_entity" ("symbol") `)
        await db.query(`ALTER TABLE "base" ADD CONSTRAINT "FK_8169d5c032175073a2cb2dced2b" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_16e57ac8478b6ea1f383e3eb03" ON "nft_entity" ("hash") `)
        await db.query(`DROP TABLE "base"`)
        await db.query(`DROP INDEX "public"."IDX_8169d5c032175073a2cb2dced2"`)
        await db.query(`ALTER TABLE "emote" DROP COLUMN "version"`)
        await db.query(`ALTER TABLE "event" DROP COLUMN "version"`)
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "version"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "hash"`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "issuer" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "symbol" DROP NOT NULL`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "version" DROP NOT NULL`)
        await db.query(`DROP INDEX "public"."IDX_16e57ac8478b6ea1f383e3eb03"`)
        await db.query(`DROP INDEX "public"."IDX_90561baea428b17fdaf8e484d7"`)
        await db.query(`DROP INDEX "public"."IDX_52aced6d11be2f40270941fe32"`)
        await db.query(`ALTER TABLE "base" DROP CONSTRAINT "FK_8169d5c032175073a2cb2dced2b"`)
    }
}

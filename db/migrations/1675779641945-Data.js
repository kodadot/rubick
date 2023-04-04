module.exports = class Data1675779641945 {
    name = 'Data1675779641945'

    async up(db) {
        await db.query(`CREATE TABLE "resource" ("id" character varying NOT NULL, "src" text, "metadata" text, "slot" text, "thumb" text, "priority" integer NOT NULL, "pending" boolean NOT NULL, "meta_id" character varying, "nft_id" character varying, CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7051669e23906fb1d9244b224c" ON "resource" ("meta_id") `)
        await db.query(`CREATE INDEX "IDX_3835ff3c52c06c0f8aaa3f9506" ON "resource" ("nft_id") `)
        await db.query(`ALTER TABLE "nft_entity" ADD "parent_id" character varying`)
        await db.query(`CREATE INDEX "IDX_2671695ceee965b07704b54b2b" ON "nft_entity" ("parent_id") `)
        await db.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_7051669e23906fb1d9244b224c1" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_3835ff3c52c06c0f8aaa3f95061" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_2671695ceee965b07704b54b2be" FOREIGN KEY ("parent_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "resource"`)
        await db.query(`DROP INDEX "public"."IDX_7051669e23906fb1d9244b224c"`)
        await db.query(`DROP INDEX "public"."IDX_3835ff3c52c06c0f8aaa3f9506"`)
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "parent_id"`)
        await db.query(`DROP INDEX "public"."IDX_2671695ceee965b07704b54b2b"`)
        await db.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_7051669e23906fb1d9244b224c1"`)
        await db.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_3835ff3c52c06c0f8aaa3f95061"`)
        await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_2671695ceee965b07704b54b2be"`)
    }
}

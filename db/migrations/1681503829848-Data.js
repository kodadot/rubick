module.exports = class Data1681503829848 {
    name = 'Data1681503829848'

    async up(db) {
        await db.query(`CREATE TABLE "part" ("id" character varying NOT NULL, "name" text NOT NULL, "equippable" text array, "metadata" text, "src" text, "thumb" text, "type" character varying(5) NOT NULL, "z" integer NOT NULL, "base_id" character varying, "meta_id" character varying, CONSTRAINT "PK_58888debdf048d2dfe459aa59da" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eb9c6227aa57a31b1ae1aa562e" ON "part" ("base_id") `)
        await db.query(`CREATE INDEX "IDX_105a0f423a9c3e75b58156e70e" ON "part" ("meta_id") `)
        await db.query(`ALTER TABLE "resource" DROP COLUMN "slot"`)
        await db.query(`ALTER TABLE "base" ADD "events" jsonb`)
        await db.query(`ALTER TABLE "resource" ADD "parts" text array`)
        await db.query(`ALTER TABLE "resource" ADD "base_id" character varying`)
        await db.query(`ALTER TABLE "resource" ADD "slot_id" character varying`)
        await db.query(`ALTER TABLE "nft_entity" ADD "equipped_id" character varying`)
        await db.query(`CREATE INDEX "IDX_d642baad1c299522a6a2a42d32" ON "resource" ("base_id") `)
        await db.query(`CREATE INDEX "IDX_170d8671cccd2c4597a75bd5b7" ON "resource" ("slot_id") `)
        await db.query(`CREATE INDEX "IDX_730c0494be69b620692ab83143" ON "nft_entity" ("equipped_id") `)
        await db.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_eb9c6227aa57a31b1ae1aa562e3" FOREIGN KEY ("base_id") REFERENCES "base"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "part" ADD CONSTRAINT "FK_105a0f423a9c3e75b58156e70e6" FOREIGN KEY ("meta_id") REFERENCES "metadata_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_d642baad1c299522a6a2a42d32c" FOREIGN KEY ("base_id") REFERENCES "base"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "resource" ADD CONSTRAINT "FK_170d8671cccd2c4597a75bd5b7a" FOREIGN KEY ("slot_id") REFERENCES "part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_730c0494be69b620692ab831438" FOREIGN KEY ("equipped_id") REFERENCES "part"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "part"`)
        await db.query(`DROP INDEX "public"."IDX_eb9c6227aa57a31b1ae1aa562e"`)
        await db.query(`DROP INDEX "public"."IDX_105a0f423a9c3e75b58156e70e"`)
        await db.query(`ALTER TABLE "resource" ADD "slot" text`)
        await db.query(`ALTER TABLE "base" DROP COLUMN "events"`)
        await db.query(`ALTER TABLE "resource" DROP COLUMN "parts"`)
        await db.query(`ALTER TABLE "resource" DROP COLUMN "base_id"`)
        await db.query(`ALTER TABLE "resource" DROP COLUMN "slot_id"`)
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "equipped_id"`)
        await db.query(`DROP INDEX "public"."IDX_d642baad1c299522a6a2a42d32"`)
        await db.query(`DROP INDEX "public"."IDX_170d8671cccd2c4597a75bd5b7"`)
        await db.query(`DROP INDEX "public"."IDX_730c0494be69b620692ab83143"`)
        await db.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_eb9c6227aa57a31b1ae1aa562e3"`)
        await db.query(`ALTER TABLE "part" DROP CONSTRAINT "FK_105a0f423a9c3e75b58156e70e6"`)
        await db.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_d642baad1c299522a6a2a42d32c"`)
        await db.query(`ALTER TABLE "resource" DROP CONSTRAINT "FK_170d8671cccd2c4597a75bd5b7a"`)
        await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_730c0494be69b620692ab831438"`)
    }
}

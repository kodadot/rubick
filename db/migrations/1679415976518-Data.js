module.exports = class Data1679415976518 {
    name = 'Data1679415976518'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_52aced6d11be2f40270941fe32"`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "issuer" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`CREATE UNIQUE INDEX "IDX_52aced6d11be2f40270941fe32" ON "collection_entity" ("symbol") `)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "issuer" SET NOT NULL`)
    }
}

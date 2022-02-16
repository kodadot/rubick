module.exports = class Data1645015239078 {
  name = 'Data1645015239078'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "hash" text NOT NULL`)
    await db.query(`CREATE INDEX "IDX_16e57ac8478b6ea1f383e3eb03" ON "nft_entity" ("hash") `)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "hash"`)
    await db.query(`DROP INDEX "public"."IDX_16e57ac8478b6ea1f383e3eb03"`)
  }
}

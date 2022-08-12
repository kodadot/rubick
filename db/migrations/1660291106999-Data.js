module.exports = class Data1660291106999 {
  name = 'Data1660291106999'

  async up(db) {
    await db.query(`CREATE INDEX "IDX_54ca209d76ebe11ccc3c4e75d1" ON "nft_entity" ("name") `)
    await db.query(`CREATE INDEX "IDX_0a42c2c09b35a7535045d4a2f4" ON "nft_entity" ("current_owner") `)
    await db.query(`CREATE INDEX "IDX_b0d709797451c6237e8ec0fee8" ON "collection_entity" ("name") `)
  }

  async down(db) {
    await db.query(`DROP INDEX "public"."IDX_54ca209d76ebe11ccc3c4e75d1"`)
    await db.query(`DROP INDEX "public"."IDX_0a42c2c09b35a7535045d4a2f4"`)
    await db.query(`DROP INDEX "public"."IDX_b0d709797451c6237e8ec0fee8"`)
  }
}

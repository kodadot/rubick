module.exports = class Data1666001811868 {
  name = 'Data1666001811868'

  async up(db) {
    await db.query(`ALTER TABLE "collection_entity" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`)
    await db.query(`ALTER TABLE "collection_entity" ADD "nft_count" integer NOT NULL`)
    await db.query(`ALTER TABLE "collection_entity" ADD "supply" integer NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "updated_at"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "nft_count"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "supply"`)
  }
}

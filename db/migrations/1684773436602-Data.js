module.exports = class Data1684773436602 {
  name = 'Data1684773436602'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "lewd" boolean NOT NULL DEFAULT false`)
    await db.query(`ALTER TABLE "nft_entity" ALTER COLUMN "lewd" DROP DEFAULT`)
    await db.query(`ALTER TABLE "collection_entity" ADD "lewd" boolean NOT NULL DEFAULT false`)
    await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "lewd" DROP DEFAULT`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "lewd"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "lewd"`)
  }
}

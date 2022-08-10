module.exports = class Data1660092269918 {
  name = 'Data1660092269918'

  async up(db) {
    await db.query(`ALTER TABLE "nft_entity" ADD "emote_count" integer`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "emote_count"`)
  }
}

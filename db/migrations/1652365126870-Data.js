module.exports = class Data1652365126870 {
  name = 'Data1652365126870'

  async up(db) {
    await db.query(`ALTER TABLE "series" ADD "emote_count" integer`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "emote_count"`)
  }
}

module.exports = class Data1656868613783 {
  name = 'Data1656868613783'

  async up(db) {
    await db.query(`ALTER TABLE "spotlight" ADD "score" numeric NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "spotlight" DROP COLUMN "score"`)
  }
}

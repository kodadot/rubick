module.exports = class Data1660328756167 {
  name = 'Data1660328756167'

  async up(db) {
    await db.query(`ALTER TABLE "spotlight" ADD "score" numeric`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "spotlight" DROP COLUMN "score"`)
  }
}

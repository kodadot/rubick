module.exports = class Data1654265159164 {
  name = 'Data1654265159164'

  async up(db) {
    await db.query(`ALTER TABLE "series" ADD "issuer" text`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "issuer"`)
  }
}

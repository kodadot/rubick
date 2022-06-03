module.exports = class Data1654263619001 {
  name = 'Data1654263619001'

  async up(db) {
    await db.query(`ALTER TABLE "series" ADD "issuer" text`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "issuer"`)
  }
}

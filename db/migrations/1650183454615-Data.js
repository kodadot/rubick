module.exports = class Data1650183454615 {
  name = 'Data1650183454615'

  async up(db) {
    await db.query(`ALTER TABLE "series" ADD "highest_price" numeric`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "highest_price"`)
  }
}

module.exports = class Data1650183454615 {
  name = 'Data1650183454615'

  async up(db) {
    await db.query(`ALTER TABLE "series" ADD "highest_sale" numeric`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "highest_sale"`)
  }
}

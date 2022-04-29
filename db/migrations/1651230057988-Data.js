module.exports = class Data1651230057988 {
  name = 'Data1651230057988'

  async up(db) {
    await db.query(`ALTER TABLE "series" ADD "highest_price" numeric`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "highest_price"`)
  }
}

module.exports = class Data1649244965659 {
  name = 'Data1649244965659'

  async up(db) {
    await db.query(`ALTER TABLE "event" ADD "current_owner" text NOT NULL`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "event" DROP COLUMN "current_owner"`)
  }
}

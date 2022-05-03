module.exports = class Data1651571033181 {
  name = 'Data1651571033181'

  async up(db) {
    await db.query(`ALTER TABLE "collection_entity" RENAME COLUMN "current_owner1" TO "current_owner"`)
    await db.query(`ALTER TABLE "series" DROP COLUMN "highest_price"`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "collection_entity" RENAME COLUMN "current_owner" TO "current_owner1"`)
    await db.query(`ALTER TABLE "series" ADD "highest_price" numeric`)
  }
}

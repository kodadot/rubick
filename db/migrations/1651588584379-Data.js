module.exports = class Data1651588584379 {
    name = 'Data1651588584379'
  
    async up(db) {
      await db.query(`ALTER TABLE "series" RENAME COLUMN "highest_price" TO "highest_sale"`)
    }
  
    async down(db) {
      await db.query(`ALTER TABLE "series" RENAME COLUMN "highest_sale" TO "highest_price"`)
    }
  }
  
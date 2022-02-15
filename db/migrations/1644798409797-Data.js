module.exports = class Data1644798409797 {
  name = 'Data1644798409797'

  async up(db) {
    await db.query(`ALTER TABLE "series" DROP COLUMN "average_price"`)
    await db.query(`ALTER TABLE "series" ADD "average_price" numeric`)
    await db.query(`ALTER TABLE "spotlight" DROP COLUMN "average"`)
    await db.query(`ALTER TABLE "spotlight" ADD "average" numeric`)
    await db.query(`CREATE INDEX "IDX_e9b94c49c07399bfa4bb6ab1a7" ON "series" ("sold") `)
    await db.query(`CREATE INDEX "IDX_68b808a9039892c61219f868f2" ON "series" ("name") `)
    await db.query(`CREATE INDEX "IDX_258db3cbcb3c172be89fcbf674" ON "spotlight" ("sold") `)
  }

  async down(db) {
    await db.query(`ALTER TABLE "series" ADD "average_price" text`)
    await db.query(`ALTER TABLE "series" DROP COLUMN "average_price"`)
    await db.query(`ALTER TABLE "spotlight" ADD "average" text`)
    await db.query(`ALTER TABLE "spotlight" DROP COLUMN "average"`)
    await db.query(`DROP INDEX "public"."IDX_e9b94c49c07399bfa4bb6ab1a7"`)
    await db.query(`DROP INDEX "public"."IDX_68b808a9039892c61219f868f2"`)
    await db.query(`DROP INDEX "public"."IDX_258db3cbcb3c172be89fcbf674"`)
  }
}

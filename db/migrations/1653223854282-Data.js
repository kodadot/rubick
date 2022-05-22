module.exports = class Data1653223854282 {
  name = 'Data1653223854282'

  async up(db) {
    await db.query(`CREATE TABLE "collector" ("id" character varying NOT NULL, "name" text NOT NULL, "unique" integer NOT NULL, "unique_collectors" integer NOT NULL, "collections" integer NOT NULL, "total" integer NOT NULL, "average" numeric, "volume" numeric, "max" numeric, CONSTRAINT "PK_0d93071208ac3e8dd49506d903f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_d2a6b09fab598ea3dad4f89556" ON "collector" ("volume") `)
  }

  async down(db) {
    await db.query(`DROP TABLE "collector"`)
    await db.query(`DROP INDEX "public"."IDX_d2a6b09fab598ea3dad4f89556"`)
  }
}

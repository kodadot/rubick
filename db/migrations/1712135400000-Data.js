module.exports = class Data1712135400000 {
  name = 'Data1712135400000'

  async up(db) {
    await db.query(`ALTER TABLE "collection_entity" ADD "attributes" jsonb`)
    await db.query(`ALTER TABLE "collection_entity" ADD "base_uri" text`)
    await db.query(`ALTER TABLE "collection_entity" ADD "kind" character varying(11)`)
    await db.query(`ALTER TABLE "collection_entity" ADD "recipient" text`)
    await db.query(`ALTER TABLE "collection_entity" ADD "royalty" numeric`)
    await db.query(`ALTER TABLE "collection_entity" ADD "type" character varying(8)`)
    await db.query(`ALTER TABLE "collection_entity" ADD "settings" jsonb`)
    await db.query(`ALTER TABLE "nft_entity" ADD "attributes" jsonb`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "attributes"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "settings"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "type"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "royalty"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "recipient"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "kind"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "base_uri"`)
    await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "attributes"`)
  }
}

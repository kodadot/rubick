module.exports = class Data1691745365756 {
    name = 'Data1691745365756'

    async up(db) {
        await db.query(`ALTER TABLE "collection_entity" ADD "volume" numeric`)
        await db.query(`UPDATE "collection_entity" SET "volume" = 0`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "volume"`)
    }
}

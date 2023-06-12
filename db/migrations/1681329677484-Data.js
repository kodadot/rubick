module.exports = class Data1681329677484 {
    name = 'Data1681329677484'

    async up(db) {
        await db.query(`ALTER TABLE "collection_entity" ADD "burned" boolean NOT NULL DEFAULT false`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "burned" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "burned"`)
    }
}

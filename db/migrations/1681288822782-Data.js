module.exports = class Data1681288822782 {
    name = 'Data1681288822782'

    async up(db) {
        await db.query(`ALTER TABLE "collection_entity" ADD "distribution" integer NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "collection_entity" ADD "floor" numeric NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "collection_entity" ADD "highest_sale" numeric NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "collection_entity" ADD "owner_count" integer NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "collection_entity" ADD "volume" numeric NOT NULL DEFAULT '0'`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "distribution" DROP DEFAULT`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "floor" DROP DEFAULT`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "highest_sale" DROP DEFAULT`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "owner_count" DROP DEFAULT`)
        await db.query(`ALTER TABLE "collection_entity" ALTER COLUMN "volume" DROP DEFAULT`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "distribution"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "floor"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "highest_sale"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "owner_count"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "volume"`)
    }
}

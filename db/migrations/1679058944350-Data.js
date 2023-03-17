module.exports = class Data1679058944350 {
    name = 'Data1679058944350'

    async up(db) {
        await db.query(`ALTER TABLE "nft_entity" ADD "image" text`)
        await db.query(`ALTER TABLE "nft_entity" ADD "media" text`)
        await db.query(`ALTER TABLE "collection_entity" ADD "image" text`)
        await db.query(`ALTER TABLE "collection_entity" ADD "media" text`)
        await db.query(`UPDATE "nft_entity" SET image = me.image, media = me.animation_url FROM metadata_entity me WHERE metadata = me.id`)
        await db.query(`UPDATE "collection_entity" SET image = me.image, media = me.animation_url FROM metadata_entity me WHERE metadata = me.id`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "image"`)
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "media"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "image"`)
        await db.query(`ALTER TABLE "collection_entity" DROP COLUMN "media"`)
    }
}

module.exports = class Data1676574032719 {
    name = 'Data1676574032719'

    async up(db) {
        await db.query(`ALTER TABLE "nft_entity" ADD "royalty" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "royalty"`)
    }
}

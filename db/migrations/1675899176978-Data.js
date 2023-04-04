module.exports = class Data1675899176978 {
    name = 'Data1675899176978'

    async up(db) {
        await db.query(`ALTER TABLE "nft_entity" ADD "pending" boolean NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "pending"`)
    }
}

module.exports = class Data1679570258760 {
    name = 'Data1679570258760'

    async up(db) {
        await db.query(`ALTER TABLE "nft_entity" ADD "recipient" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft_entity" DROP COLUMN "recipient"`)
    }
}

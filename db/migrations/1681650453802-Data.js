module.exports = class Data1681650453802 {
    name = 'Data1681650453802'

    async up(db) {
        await db.query(`ALTER TABLE "part" ALTER COLUMN "z" DROP NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "part" ALTER COLUMN "z" SET NOT NULL`)
    }
}

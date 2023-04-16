module.exports = class Data1681650285646 {
    name = 'Data1681650285646'

    async up(db) {
        await db.query(`CREATE TABLE "property" ("id" character varying NOT NULL, "key" text NOT NULL, "value" text NOT NULL, "type" text NOT NULL, "mutable" boolean NOT NULL, "nft_id" character varying, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e8ead80cf8ed86716aa80ef45e" ON "property" ("nft_id") `)
        await db.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_e8ead80cf8ed86716aa80ef45e7" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "property"`)
        await db.query(`DROP INDEX "public"."IDX_e8ead80cf8ed86716aa80ef45e"`)
        await db.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_e8ead80cf8ed86716aa80ef45e7"`)
    }
}

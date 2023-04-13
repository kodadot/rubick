module.exports = class Data1681393317164 {
    name = 'Data1681393317164'

    async up(db) {
        await db.query(`CREATE TABLE "theme" ("id" character varying NOT NULL, "name" text NOT NULL, "theme_color1" text, "theme_color2" text, "theme_color3" text, "theme_color4" text, "base_id" character varying, CONSTRAINT "PK_c1934d0b4403bf10c1ab0c18166" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_52c219cbfa98d6011518283433" ON "theme" ("base_id") `)
        await db.query(`ALTER TABLE "theme" ADD CONSTRAINT "FK_52c219cbfa98d6011518283433d" FOREIGN KEY ("base_id") REFERENCES "base"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "theme"`)
        await db.query(`DROP INDEX "public"."IDX_52c219cbfa98d6011518283433"`)
        await db.query(`ALTER TABLE "theme" DROP CONSTRAINT "FK_52c219cbfa98d6011518283433d"`)
    }
}

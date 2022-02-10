const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class cache1644279326965 {
    name = 'cache1644279326965'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "series" ("id" character varying NOT NULL, "unique" integer NOT NULL, "unique_collectors" integer NOT NULL, "sold" integer NOT NULL, "total" integer NOT NULL, "average_price" numeric, "floor_price" numeric, "buys" integer, "volume" numeric, "name" text NOT NULL, "metadata" text, "image" text, CONSTRAINT "PK_e725676647382eb54540d7128ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "spotlight" ("id" character varying NOT NULL, "collections" integer NOT NULL, "unique_collectors" integer NOT NULL, "unique" integer NOT NULL, "sold" integer NOT NULL, "total" integer NOT NULL, "average" numeric, "volume" numeric, CONSTRAINT "PK_bafc41803e508da64ed687ed3b9" PRIMARY KEY ("id"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "spotlight"`);
        await queryRunner.query(`DROP TABLE "series"`);
    }
}

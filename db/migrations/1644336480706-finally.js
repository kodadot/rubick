const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class finally1644336480706 {
    name = 'finally1644336480706'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "cache_status" ("id" character varying NOT NULL, "last_block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1001e39eb0aa38d043d96f7f4fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b77813224451c8efd9125a094f" ON "series" ("unique") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c3f43293bdb75dfeeb729b9ca" ON "series" ("unique_collectors") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9b94c49c07399bfa4bb6ab1a7" ON "series" ("sold") `);
        await queryRunner.query(`CREATE INDEX "IDX_fd4a323c9a9fcea9e6ff007963" ON "series" ("total") `);
        await queryRunner.query(`CREATE INDEX "IDX_47fd32d794d5525e7405568350" ON "series" ("average_price") `);
        await queryRunner.query(`CREATE INDEX "IDX_29bf806c135c627c4585f91587" ON "series" ("floor_price") `);
        await queryRunner.query(`CREATE INDEX "IDX_2bbe872967ecbc05cd0dfbc889" ON "series" ("buys") `);
        await queryRunner.query(`CREATE INDEX "IDX_e8b1744b847632e650ecbcc9a4" ON "series" ("volume") `);
        await queryRunner.query(`CREATE INDEX "IDX_68b808a9039892c61219f868f2" ON "series" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd29f2e36aa1dcd012f5e8343b" ON "spotlight" ("collections") `);
        await queryRunner.query(`CREATE INDEX "IDX_f93eb7ca3bfc435f7654b20de4" ON "spotlight" ("unique_collectors") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c832ef457aecb9dc9f545a1be" ON "spotlight" ("unique") `);
        await queryRunner.query(`CREATE INDEX "IDX_258db3cbcb3c172be89fcbf674" ON "spotlight" ("sold") `);
        await queryRunner.query(`CREATE INDEX "IDX_403ef0b49779026a618c2dae76" ON "spotlight" ("total") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b01a39716acd6d055dced8e60" ON "spotlight" ("average") `);
        await queryRunner.query(`CREATE INDEX "IDX_79cfe482f61cd289665f6ec824" ON "spotlight" ("volume") `);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_79cfe482f61cd289665f6ec824"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b01a39716acd6d055dced8e60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_403ef0b49779026a618c2dae76"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_258db3cbcb3c172be89fcbf674"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c832ef457aecb9dc9f545a1be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f93eb7ca3bfc435f7654b20de4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd29f2e36aa1dcd012f5e8343b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68b808a9039892c61219f868f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e8b1744b847632e650ecbcc9a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2bbe872967ecbc05cd0dfbc889"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29bf806c135c627c4585f91587"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47fd32d794d5525e7405568350"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fd4a323c9a9fcea9e6ff007963"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9b94c49c07399bfa4bb6ab1a7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c3f43293bdb75dfeeb729b9ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b77813224451c8efd9125a094f"`);
        await queryRunner.query(`DROP TABLE "cache_status"`);
    }
}

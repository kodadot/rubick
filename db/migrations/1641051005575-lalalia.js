const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class lalalia1641051005575 {
    name = 'lalalia1641051005575'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "nft_entity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "nft_entity" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "collection_entity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "collection_entity" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "nft_entity" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "nft_entity" DROP COLUMN "created_at"`);
    }
}

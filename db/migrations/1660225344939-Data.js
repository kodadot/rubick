module.exports = class Data1660225344939 {
  name = 'Data1660225344939'

  async up(db) {
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_9380d479563e5a664759359470a"`)
    await db.query(`ALTER TABLE "event" ALTER COLUMN "nft_id" DROP NOT NULL`)
    await db.query(`ALTER TABLE "emote" DROP CONSTRAINT "FK_463234b85d428ddde1bce271829"`)
    await db.query(`ALTER TABLE "emote" ALTER COLUMN "nft_id" DROP NOT NULL`)
    await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a"`)
    await db.query(`ALTER TABLE "nft_entity" ALTER COLUMN "collection_id" DROP NOT NULL`)
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_9380d479563e5a664759359470a" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "emote" ADD CONSTRAINT "FK_463234b85d428ddde1bce271829" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a" FOREIGN KEY ("collection_id") REFERENCES "collection_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_9380d479563e5a664759359470a" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "event" ALTER COLUMN "nft_id" SET NOT NULL`)
    await db.query(`ALTER TABLE "emote" ADD CONSTRAINT "FK_463234b85d428ddde1bce271829" FOREIGN KEY ("nft_id") REFERENCES "nft_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "emote" ALTER COLUMN "nft_id" SET NOT NULL`)
    await db.query(`ALTER TABLE "nft_entity" ADD CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a" FOREIGN KEY ("collection_id") REFERENCES "collection_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "nft_entity" ALTER COLUMN "collection_id" SET NOT NULL`)
    await db.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_9380d479563e5a664759359470a"`)
    await db.query(`ALTER TABLE "emote" DROP CONSTRAINT "FK_463234b85d428ddde1bce271829"`)
    await db.query(`ALTER TABLE "nft_entity" DROP CONSTRAINT "FK_4b98bf4d630de0037475b9bbb7a"`)
  }
}

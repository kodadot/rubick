export const nftEmoteQuery = `SELECT 
  value as id,
  count(value)
  FROM emote WHERE nft_id = $1
  GROUP BY value`;
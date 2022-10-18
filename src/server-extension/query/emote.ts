export const nftEmoteQuery = `SELECT 
  value as id,
  count(value)
  FROM emote WHERE nft_id = $1
  GROUP BY value`;

export const nftEmoteMapQuery = `WITH stats AS (${nftEmoteQuery})
  SELECT 
    jsonb_object_agg (id, count) as counts
  FROM stats
`;
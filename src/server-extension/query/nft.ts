export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`


export const flippingQuery = `SELECT
ne.issuer AS author,
e.nft_id,
ne.created_at AS date,
ne.price AS current,
COUNT(e.*) AS total_flip,
COUNT(DISTINCT e.current_owner) AS prev_owners,
s.floor_price,
s.total,
s.unique_collectors,
s.emote_count
FROM event e
LEFT JOIN nft_entity ne ON e.nft_id = ne.id
LEFT JOIN series s ON s.id = ne.collection_id
WHERE e.interaction = 'BUY' AND ne.burned = 'false'
GROUP BY author, e.nft_id, date, current, floor_price, s.total, s.unique_collectors, s.emote_count
ORDER BY total_flip DESC
LIMIT $1
OFFSET $2`

export const previousPriceQuery = (idList: string) => `WITH ranking AS (
    SELECT 
      nft_id, 
      meta,
      Rank() OVER (
        partition BY nft_id 
        ORDER BY 
          e.timestamp DESC
      ) AS rank 
    FROM 
      event e 
    WHERE 
      e.nft_id IN (${idList})
  ) 
  SELECT 
    * 
  FROM 
    ranking 
  WHERE 
    rank IN (2);`
export const salesQuery = `SELECT
    ne.id,
    ne.name,
    ce.name as collection_name,
    ne.issuer,
    collection_id,
    e.caller as buyer,
    (e.meta::bigint) as sale_price,
    e.timestamp,
    e.block_number,
    me.image
FROM nft_entity ne
    JOIN collection_entity ce on ce.id = collection_id
    LEFT join event as e on e.nft_id = ne.id
    LEFT join metadata_entity me on me.id = ne.metadata
where
    e.interaction = 'BUY'
    and e.timestamp >= NOW() - INTERVAL '7 DAY'
ORDER BY e.timestamp desc`

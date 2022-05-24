export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`

export const flippingQuery = `SELECT
    ne.issuer AS author,
    e.nft_id,
    ne.created_at AS date,
    ne.price AS current,
    COUNT(e.*),
    s.floor_price,
    s.total,
    s.unique_collectors,
    s.emote_count
FROM event e
LEFT JOIN nft_entity ne ON e.nft_id = ne.id
LEFT JOIN series s ON s.id = ne.collection_id
WHERE e.interaction = 'BUY' AND ne.burned = 'false'
GROUP BY author, e.nft_id, date, current, floor_price, s.total, s.unique_collectors, s.emote_count
ORDER BY count DESC
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
export const maxBuy = `SELECT 
    date(e.timestamp), 
    COALESCE(MAX(e.meta::decimal), 0) as value, 
    COALESCE(AVG(e.meta::decimal), 0) as average, 
    COUNT(e.*) as count
    FROM event e 
    LEFT JOIN nft_entity ne on ne.id = e.nft_id 
    WHERE e.interaction = 'BUY' AND ne.collection_id = $1 
    GROUP BY date(e.timestamp) 
    ORDER BY date(e.timestamp) ASC;`

  export const floorList = `SELECT 
    date(e.timestamp), 
    COALESCE(MIN(e.meta::decimal), 0) as value,
    COUNT(e.*) as count
    FROM event e 
    LEFT JOIN nft_entity ne on ne.id = e.nft_id 
    WHERE e.interaction = 'LIST' AND ne.collection_id = $1 
    GROUP BY date(e.timestamp) 
    ORDER BY date(e.timestamp) ASC;`

export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`

export const flippingQuery = `select
ne.issuer as author,
e.nft_id,
ne.created_at as date,
ne.price as current,
count(e.*),
s.floor_price,
s.total,
s.unique_collectors,
s.emote_count
from event e
left join nft_entity ne on e.nft_id = ne.id
left join series s on s.id = ne.collection_id
where e.interaction = 'BUY' and ne.burned = 'false'
group by
author,
e.nft_id,
date,
current,
floor_price,
s.total,
s.unique_collectors,
s.emote_count
order by count desc
limit 20`
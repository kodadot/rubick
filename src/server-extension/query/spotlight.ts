export const spotlightSoldHistory = `SELECT
  ne.issuer as spotlight_id,
  DATE(e.timestamp),
  count(e) as count
FROM
  nft_entity ne
  JOIN event e on e.nft_id = ne.id
WHERE
  e.interaction = 'BUY'
  and ne.issuer != ne.current_owner
  and ne.issuer = $1
  and e.timestamp >= NOW() - INTERVAL '30 DAY'
GROUP BY
  ne.issuer,
  DATE(e.timestamp)
ORDER BY
  DATE(e.timestamp)`
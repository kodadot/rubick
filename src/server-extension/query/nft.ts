export const passionQuery = `SELECT DISTINCT ne.issuer as id
FROM nft_entity ne
WHERE ne.current_owner = $1
AND ne.current_owner != ne.issuer`

export const salesQuery = `SELECT
    ne.id,
    ne.name,
    ce.name as collection_name,
    ne.issuer,
    collection_id,
    e.caller as buyer,
    (e.meta::decimal) as sale_price,
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
ORDER BY e.timestamp DESC`

export const hotDashboardQuery = (dateRange: string): string => `SELECT
    e.timestamp,
    e.meta,
    ce.name as collection_name,
    ce.id as collection_id
FROM
    event e
    LEFT JOIN nft_entity ne ON e.nft_id = ne.id
    LEFT JOIN collection_entity ce ON ne.collection_id = ce.id
WHERE
    e.interaction = 'BUY'
    AND e.timestamp >= NOW() - INTERVAL '${dateRange}'
ORDER BY
    e.timestamp`


export const rootOwnerQuery = `with recursive part as (
    select id, name, current_owner, parent_id from nft_entity where id = $1 
    union
    select pe.id, pe.name, pe.current_owner, pe.parent_id from nft_entity pe
    join part p on p.parent_id = pe.id
   )
   select id, name, current_owner
   from part
   where parent_id is null
   limit 1`

export const parentBaseResouceQuery = `
    SELECT *  FROM resource r 
    WHERE r.nft_id = $1
    AND r.base_id = $2
`

export const childItemsQuery = `SELECT
        ne.id,
        ne.name,
        ne.image,
        ne.media,
        ne.pending,
        r.metadata as resource_metadata,
        r.thumb as resource_thumb,
        r.src as resource_src,
        p.z as z
    FROM nft_entity ne
            LEFT JOIN resource r
                    ON ne.id = r.nft_id
                        AND r.slot_id = ne.equipped_id
            LEFT JOIN part p on p.meta_id = r.id
    WHERE ne.parent_id = $1
`

export const nestedChildrenQuery = `WITH RECURSIVE part AS (
    SELECT id, name, current_owner, parent_id, price
    FROM nft_entity
    WHERE parent_id = $1
    UNION
    SELECT pe.id, pe.name, pe.current_owner, pe.parent_id, pe.price
    FROM nft_entity pe
             JOIN part p ON p.id = pe.parent_id
)
   select id, name, current_owner, price
   from part`
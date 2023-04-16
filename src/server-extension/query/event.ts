export const buyEvent = `
  SELECT COUNT(e.*) AS COUNT,
        COALESCE(MAX(e.meta::decimal), 0) AS MAX
  FROM event e
  LEFT JOIN nft_entity ne ON ne.id = e.nft_id
  WHERE e.interaction = 'BUY'
    AND ne.collection_id = $1;
`;

export const collectionEventHistory = (idList: string, dateRange: string) => `
  SELECT ce.id AS id,
       DATE(e.timestamp),
       count(e)
  FROM nft_entity ne
  JOIN collection_entity ce ON ce.id = ne.collection_id
  JOIN event e ON e.nft_id = ne.id
  WHERE e.interaction = 'BUY'
    AND ce.id in (${idList}) 
    ${dateRange}
  GROUP BY ce.id,
          DATE(e.timestamp)
  ORDER BY DATE(e.timestamp)
`;

export const lastEventQuery = (whereCondition: string) => `
  SELECT DISTINCT ne.id AS id,
                ne.name AS name,
                ne.issuer AS issuer,
                ne.metadata AS metadata,
                e.current_owner,
                me.image AS image,
                me.animation_url,
                MAX(e.timestamp) AS timestamp,
                MAX(e.meta::decimal) AS value,
                ne.collection_id AS collection_id,
                ce.name AS collection_name
  FROM event e
  JOIN nft_entity ne ON e.nft_id = ne.id
  LEFT JOIN metadata_entity me ON me.id = ne.metadata
  LEFT JOIN collection_entity ce ON ne.collection_id = ce.id
  WHERE e.interaction = $1
    AND ne.burned = FALSE 
    ${whereCondition}
  GROUP BY ne.id,
          me.id,
          e.current_owner,
          me.image,
          ce.name
  ORDER BY MAX(e.timestamp) DESC
  LIMIT $2
  OFFSET $3
`;

export const resourcesByNFT = (whereCondition: string) => `
  SELECT r.id as id,
        r.src as src,
        r.metadata as metadata,
        r.slot_id,
        r.thumb as thumb,
        r.priority as priority,
        r.pending as pending,
        CASE 
        WHEN me.id IS NULL THEN NULL
        ELSE json_strip_nulls(
                json_build_object(
                  'attributes', me.attributes,
                  'name', me.name,
                  'description', me.description,
                  'id', me.id,
                  'animation_url', me.animation_url,
                  'type', me.type,
                  'image', me.image
                )
              )
        END AS meta,
        json_strip_nulls(
          json_build_object(
            'block_number', ne.block_number,
            'burned', ne.burned,
            'collection_id', ne.collection_id,
            'created_at', ne.created_at,
            'current_owner', ne.current_owner,
            'emote_count', ne.emote_count,
            'hash', ne.hash,
            'id', ne.id,
            'image', ne.image,
            'instance', ne.instance,
            'issuer', ne.issuer,
            'media', ne.media,
            'meta_id', ne.meta_id,
            'metadata', ne.metadata,
            'name', ne.name,
            'parent_id', ne.parent_id,
            'pending', ne.pending,
            'price', ne.price,
            'recipient', ne.recipient,
            'royalty', ne.royalty,
            'sn', ne.sn,
            'transferable', ne.transferable,
            'updated_at', ne.updated_at,
            'version', ne.version
          )
        ) as nft,
        r.nft_id as nft_id
  FROM resource r
  LEFT JOIN nft_entity ne ON ne.id = r.nft_id
  LEFT JOIN metadata_entity me ON me.id = r.meta_id
  WHERE ${whereCondition}
  GROUP BY r.id, ne.id, me.id
  `;

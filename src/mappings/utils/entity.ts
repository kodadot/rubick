import { takeFirst } from '@kodadot1/metasquid'
import { findByRawQuery } from '@kodadot1/metasquid/entity'
import { FindOptionsWhere } from 'typeorm'
import { NFTEntity, Resource } from '../../model'
import { nestedChildrenQuery, parentBaseResouceQuery, rootOwnerQuery } from '../../server-extension/query/nft'
import { EntityConstructor, Store } from './types'

export type EntityWithId = {
  id: string
}

export async function createOrElseThrow<T extends EntityWithId>(
  store: Store,
  entityConstructor: EntityConstructor<T>,
  id: string,
  init: Partial<T>
): Promise<T> {
  const entity = await get(store, entityConstructor, id)
  if (entity) {
    throw new Error(`Entity with id ${id} already exists`)
  }

  return create(entityConstructor, id, init)
}

/**
 * Get or Create the provided entity with the given ID
 *
 * Note: you need to persist/save the entity yourself
 */
export async function getOrCreate<T extends EntityWithId>(
  store: Store,
  entityConstructor: EntityConstructor<T>,
  id: string,
  init: Partial<T>
): Promise<T> {
  // attempt to get the entity from the database
  let entity = await get(store, entityConstructor, id)

  // if the entity does not exist, construct a new one
  // and assign the provided ID to it
  if (entity == null) {
    entity = new entityConstructor()
    entity.id = id
    Object.assign(entity, init)
  }

  return entity
}

export async function get<T extends EntityWithId>(
  store: Store,
  entityConstructor: EntityConstructor<T>,
  id: string
): Promise<T | null> {
  const where: FindOptionsWhere<T> = { id } as FindOptionsWhere<T>
  return store.findOneBy<T>(entityConstructor, where)
}

export function create<T extends EntityWithId>(entityConstructor: EntityConstructor<T>, id: string, init: Partial<T>) {
  const entity = new entityConstructor()
  entity.id = id
  Object.assign(entity, init)
  return entity
}

// RMRK2 Specific utils

export async function findRootItemById(store: Store, id: string): Promise<NFTEntity> {
  const result = await findByRawQuery(store, NFTEntity, rootOwnerQuery, [id]).then(takeFirst)
  if (!result) {
    throw new Error(`Root item with id ${id} not found`)
  }

  return result
}

export async function findParentBaseResouce(store: Store, id: string, baseId: string): Promise<Resource> {
  const result = await findByRawQuery(store, Resource, parentBaseResouceQuery, [id, baseId]).then(takeFirst)
  if (!result) {
    throw new Error(`Parent resource with id ${id} not found`)
  }

  return result
}

export async function findAllNestedChildrenByParentId(store: Store, id: string): Promise<NFTEntity[]> {
  const result = await findByRawQuery(store, NFTEntity, nestedChildrenQuery, [id])
  return result
}

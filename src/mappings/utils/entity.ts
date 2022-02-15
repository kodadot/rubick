import { Store } from '@subsquid/substrate-processor'
import { EntityConstructor } from './types'

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
): Promise<T | undefined> {
  return store.get<T>(entityConstructor, {
    where: { id },
  })
}

export function create<T extends EntityWithId>(
  entityConstructor: EntityConstructor<T>,
  id: string,
  init: Partial<T>
) {
  const entity = new entityConstructor()
  entity.id = id
  Object.assign(entity, init)
  return entity
}

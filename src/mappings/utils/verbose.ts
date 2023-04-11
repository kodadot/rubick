import { plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { create, EntityWithId, get } from '@kodadot1/metasquid/entity'
import { EntityConstructor } from '@kodadot1/metasquid/types'
import { Context } from './types'

export async function createUnlessNotExist<T extends EntityWithId>(
  id: string,
  object: EntityConstructor<T>,
  { store }: Context
) {
  plsBe<string>(real, id)
  const entity = await get<T>(store, object, id)
  plsNotBe<T>(real, entity as T)

  return create<T>(object, id, {})
}

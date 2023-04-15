
import type { EntityManager, EntityTarget, ObjectLiteral, Repository } from 'typeorm'


export async function makeQuery<E extends ObjectLiteral, V>(txManager: () => Promise<EntityManager>, entity: EntityTarget<E>, query: string, args?: any[]): Promise<V> {
  const manager = await txManager()
  const repository = manager.getRepository(entity)
  return genericRepositoryQuery(repository, query, args)
}

export async function genericRepositoryQuery<T extends ObjectLiteral, V>(repository: Repository<T>, query: string, args?: any[]): Promise<V> {
  return repository.query(query, args) as Promise<V>
}

/**
 * @description hack sql IN parameters
 *              https://github.com/kodadot/rubick/pull/72#discussion_r873325836
 * @returns ["id1", "id2"] -> "'id1','id2'"
 */
export function toSqlInParams(list: string[]): string {
  return JSON.stringify(list).replace(/"/g, '\'').replace(/[[\]|]/g, '')
}
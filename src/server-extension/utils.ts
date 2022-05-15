
import type { EntityManager, EntityTarget, Repository } from 'typeorm'

export async function makeQuery<E, V>(txManager: () => Promise<EntityManager>, entity: EntityTarget<E>, query: string, args?: any[]): Promise<V> {
  const manager = await txManager()
  const repository = manager.getRepository(entity)
  return genericRepositoryQuery(repository, query, args)
}

export async function genericRepositoryQuery<T, V>(repository: Repository<T>, query: string, args?: any[]): Promise<V> {
  return repository.query(query, args) as Promise<V>
}
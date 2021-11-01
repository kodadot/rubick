import {createTypeUnsafe, TypeRegistry} from '@polkadot/types'
import {Codec, DetectCodec} from '@polkadot/types/types'

export const registry = new TypeRegistry()

export function create<T extends Codec = Codec, K extends string = string>(type: K, params: unknown): DetectCodec<T, K> {
  return createTypeUnsafe(registry, type, [params])
}

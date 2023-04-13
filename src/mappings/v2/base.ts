import { Optional } from '@kodadot1/metasquid/types'
import { CreatedBase, toPartId } from '@kodadot1/minimark/v2'

import { Base, BaseType, Part, PartType } from '../../model'
import { handleMetadata } from '../shared'
import { unwrap } from '../utils/extract'
import { baseId } from '../utils/helper'
import logger, { error } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { createUnlessNotExist } from '../utils/verbose'
import { getCreateBase } from './getters'

const OPERATION = Action.BASE

export async function base(context: Context) {
  let base: Optional<CreatedBase>
  try {
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getCreateBase)
    const base = interaction.value as CreatedBase
    const id = baseId(blockNumber, base.symbol)
    const final = await createUnlessNotExist(id, Base, context)
    final.issuer = caller
    final.currentOwner = caller
    final.type = (base.type as BaseType) || BaseType.mixed
    final.symbol = base.symbol.trim()
    final.metadata = base.metadata

    if (base.metadata) {
      const metadata = await handleMetadata(base.metadata, '', context.store)
      logger.debug(`[${OPERATION}] ${final.id} metadata ${metadata?.id}`)
      final.meta = metadata
    }

    await context.store.save(final)

    // id of part is partId
    if (base.parts.length > 0) {
      for (const basePart of base.parts) {
        const partId = toPartId(id, basePart.id)
        const part = await createUnlessNotExist(partId, Part, context)
        part.name = basePart.id
        part.base = final
        part.id = partId
        part.metadata = basePart.metadata
        part.type = basePart.type as PartType
        

        if (basePart.metadata) {
          const metadata = await handleMetadata(basePart.metadata, '', context.store)
          part.meta = metadata
        }

        await context.store.save(part)
      }
    }

    // TODO: themes
    // if (base.themes) {}
  } catch (e) {
    error(e, OPERATION, JSON.stringify(base))
  }
}

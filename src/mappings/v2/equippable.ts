import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'
import { Equippable } from '@vikiival/minimark/v2'


import { NFTEntity } from '../../model'
import { createEvent } from '../shared/event'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getAs, getEquippable } from './getters'

type OPERATION = Action.EQUIPPABLE

export async function equippable(context: Context) {
  let interaction: Optional<Equippable> = null

  try {
    const getE = getAs<OPERATION>()
    const { value: equip, caller, timestamp, blockNumber, version } = unwrap(context, getE);
    interaction = equip
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe(real, nft)
    plsNotBe(burned, nft)
    isOwnerOrElseError(nft, caller)
    nft.updatedAt = timestamp

    // TODO: add logic for EQUIPing resource

    logger.success(`[EQUIPABLE] ${nft.id} from ${caller}`)
    await context.store.save(nft)
    await createEvent(nft, Action.EQUIP, { blockNumber, caller, timestamp, version }, `${interaction.id}::${interaction.slot}`, context.store)

  } catch (e) {
    logError(e, (e) =>
      logger.warn(`[EQUIPABLE] ${e.message} ${JSON.stringify(interaction)}`)
    )
  }
}

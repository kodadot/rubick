import { ensure } from '@kodadot1/metasquid'
import { burned, plsBe, plsNotBe, real } from '@kodadot1/metasquid/consolidator'
import { create, get } from '@kodadot1/metasquid/entity'
import { Optional } from '@kodadot1/metasquid/types'

import { Emote, NFTEntity } from '../../model'
import { unwrap } from '../utils'
import { withMeta } from '../utils/consolidator'
import { getInteraction } from '../utils/getters'
import { emoteId } from '../utils/helper'
import logger, { logError } from '../utils/logger'
import { Context, RmrkInteraction } from '../utils/types'

export async function emote(context: Context) {
  let interaction: Optional<RmrkInteraction> = null

  try {
    const { value, caller } = unwrap(context, getInteraction);
    interaction = value
    plsBe(withMeta, interaction)
    const nft = ensure<NFTEntity>(
      await get<NFTEntity>(context.store, NFTEntity, interaction.id)
    )
    plsBe<NFTEntity>(real, nft)
    plsNotBe<NFTEntity>(burned, nft)
    const id = emoteId(interaction, caller)
    let emote = await get<Emote>(context.store, Emote, interaction.id)

    if (emote) {
      await context.store.remove(emote)
      return
    }

    emote = create<Emote>(Emote, id, {
      id,
      caller,
      value: interaction.value,
    })

    emote.nft = nft

    logger.success(`[EMOTE] ${nft.id} from ${caller}`)
    await context.store.save(emote)
  } catch (e) {
    logError(e, (e) => logger.warn(`[EMOTE] ${e.message}`))
  }
}
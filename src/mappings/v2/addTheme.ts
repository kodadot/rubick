import { Optional } from '@kodadot1/metasquid/types'
import { ThemeAdd, toThemeId } from '@kodadot1/minimark/v2'

import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Base } from '../../model'
import { unwrap } from '../utils'
import logger, { logError } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { getThemeAdd } from './getters'

const OPERATION = Action.THEMEADD

export async function addTheme(context: Context) { 
  let interaction: Optional<ThemeAdd> = null

  try {
    const getter = getThemeAdd
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getter)

    const base = await get<Base>(context.store, Base, interaction.base_id)

    const id = toThemeId(interaction.base_id, interaction.name)
    // const final = await createUnlessNotExist(id, Base, context)



    // theme_color_1: String
    // theme_color_2: String
    // theme_color_3: String
    // theme_color_4: String
    const keys = [ 'theme_color_1', 'theme_color_2', 'theme_color_3', 'theme_color_4' ]

    for (const key of keys) {
      const value = interaction.value[key]
      // base[key] = interaction[key]
    }

    // logger.success(`[${OPERATION}] NEW PRIORITY ${interaction.value} for ${nft.id} from ${caller}`)

    // TODO: add logic for accepting resource

    logger.info(`[${OPERATION}] < ${interaction.name}, ${interaction.value} > for ${interaction.base_id} from ${caller}`)
    // await context.store.save(nft)
    // await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, `${interaction.value.at(0)}`, context.store)
  } catch (e) {
    logError(e, (e) => logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`))
  }
}

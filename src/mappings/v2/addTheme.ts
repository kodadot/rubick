import { Optional } from '@kodadot1/metasquid/types'
import { ThemeAdd, toThemeId } from '@kodadot1/minimark/v2'

import { getOrFail as get } from '@kodadot1/metasquid/entity'
import { Base, Theme } from '../../model'
import { unwrap } from '../utils'
import { isOwnerOrElseError } from '../utils/consolidator'
import { camelCase } from '../utils/helper'
import logger, { logError, success } from '../utils/logger'
import { Action, Context } from '../utils/types'
import { createUnlessNotExist } from '../utils/verbose'
import { getThemeAdd } from './getters'

const OPERATION = Action.THEMEADD

export async function addTheme(context: Context) {
  let interaction: Optional<ThemeAdd> = null

  try {
    const getter = getThemeAdd
    const { value: interaction, caller, timestamp, blockNumber, version } = unwrap(context, getter)

    const base = await get<Base>(context.store, Base, interaction.base_id)
    isOwnerOrElseError(base, caller)

    const id = toThemeId(interaction.base_id, interaction.name)
    const final = await createUnlessNotExist(id, Theme, context)

    final.name = interaction.name
    final.base = base

    const keys = ['theme_color_1', 'theme_color_2', 'theme_color_3', 'theme_color_4']

    for (const key of keys) {
      const value = interaction.value[key]
      if (value && key !== 'base') {
        const camelKey = camelCase(key) as keyof Omit<Theme, 'base'>
        final[camelKey] = value
      }
    }
    // logger.success(`[${OPERATION}] NEW PRIORITY ${interaction.value} for ${nft.id} from ${caller}`)

    success(OPERATION, `< ${interaction.name}, ${interaction.value} > for ${interaction.base_id} from ${caller}`)
    await context.store.save(final)
    // await createEvent(nft, OPERATION, { blockNumber, caller, timestamp, version }, `${interaction.value.at(0)}`, context.store)
  } catch (e) {
    logError(e, (e) => logger.warn(`[${OPERATION}] ${e.message} ${JSON.stringify(interaction)}`))
  }
}

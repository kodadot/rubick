import { UnwrappedRemark } from '@kodadot1/minimark'
import { getRemark } from '../utils/getters'
import { Base, Context } from '../utils/types'



export function getCreateBase(ctx: Context): UnwrappedRemark<Base> {
  return getRemark<any>(ctx) as UnwrappedRemark<Base>
}


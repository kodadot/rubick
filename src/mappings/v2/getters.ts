import {
  Accept,
  Base,
  Burn,
  Buy,
  ChangeIssuer,
  Create,
  Emote,
  Equip,
  Equippable,
  Interaction,
  List,
  Lock,
  Mint,
  Resadd,
  Send,
  SetPriority,
  SetProperty,
  ThemeAdd,
  UnwrappedRemark,
  unwrapRemarkV2 as unwrapRemark,
  UnwrapValue,
} from '@kodadot1/minimark/v2'
import { SystemRemarkCall } from '../../types/calls'
import { Context, InteractionExtra } from '../utils/types'
import { extractExtra } from '../utils'

export function getRemark<T extends keyof UnwrapValue = 'NONE'>(ctx: Context): UnwrappedRemark<UnwrapValue[T]> {
  const { remark } = new SystemRemarkCall(ctx).asV1020
  return unwrapRemark<T>(remark.toString())
}

export function getCreateCollection(ctx: Context): UnwrappedRemark<Create> {
  return getRemark<Interaction.CREATE>(ctx)
}

export function getCreateBase(ctx: Context): UnwrappedRemark<Base> {
  return getRemark<Interaction.BASE>(ctx)
}

export function getCreateToken(ctx: Context): UnwrappedRemark<Mint> {
  return getRemark<Interaction.MINT>(ctx)
}

export function getInteraction<T extends keyof UnwrapValue = 'NONE'>(ctx: Context): UnwrappedRemark<UnwrapValue[T]> {
  return getRemark<T>(ctx)
}

export const getAs =
  <T extends keyof UnwrapValue>() =>
  (ctx: Context): UnwrappedRemark<UnwrapValue[T]> =>
    getRemark<T>(ctx)

export function getAcceptResource(ctx: Context): UnwrappedRemark<Accept> {
  return getRemark<Interaction.ACCEPT>(ctx)
}

export function getEquip(ctx: Context): UnwrappedRemark<Equip> {
  return getRemark<Interaction.EQUIP>(ctx)
}

export function getEquippable(ctx: Context): UnwrappedRemark<Equippable> {
  return getRemark<Interaction.EQUIPPABLE>(ctx)
}

export function getLock(ctx: Context): UnwrappedRemark<Lock> {
  return getRemark<Interaction.LOCK>(ctx)
}

export function getAddRes(ctx: Context): UnwrappedRemark<Resadd> {
  return getRemark<Interaction.RESADD>(ctx)
}

export function getSetPriority(ctx: Context): UnwrappedRemark<SetPriority> {
  return getRemark<Interaction.SETPRIORITY>(ctx)
}

export function getSetProperty(ctx: Context): UnwrappedRemark<SetProperty> {
  return getRemark<Interaction.SETPROPERTY>(ctx)
}

export function getThemeAdd(ctx: Context): UnwrappedRemark<ThemeAdd> {
  return getRemark<Interaction.THEMEADD>(ctx)
}

export function getBuy(ctx: Context): UnwrappedRemark<Buy> & InteractionExtra {
  const extra = extractExtra(ctx)
  return { ...getRemark<Interaction.BUY>(ctx), extra }
}

export function getEmote(ctx: Context): UnwrappedRemark<Emote> {
  return getRemark<Interaction.EMOTE>(ctx)
}

export function getSend(ctx: Context): UnwrappedRemark<Send> {
  return getRemark<Interaction.SEND>(ctx)
}

export function getList(ctx: Context): UnwrappedRemark<List> {
  return getRemark<Interaction.LIST>(ctx)
}

export function getChangeIssuer(ctx: Context): UnwrappedRemark<ChangeIssuer> {
  return getRemark<Interaction.CHANGEISSUER>(ctx)
}

// export function getCreate(ctx: Context): UnwrappedRemark<Create> {}

export function getBurn(ctx: Context): UnwrappedRemark<Burn> {
  return getRemark<Interaction.BURN>(ctx)
}

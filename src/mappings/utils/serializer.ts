export const serializer = (_: any, v: any) => typeof v === 'bigint' ? v.toString() : v


/**
 * Recursively make fields optional.
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>
}

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

/**
 * note: not inclusive for the latter. `IntRange<1,3>` becomes `1 | 2`
 */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type PartialRequired<R extends Record<string, unknown>, K extends keyof R> = Partial<R> &
  Required<{ [k in K]: R[k] }>

export type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never
export type Tail<T extends unknown[]> = T extends [unknown, ...infer R] ? R : never

export type Tuple<
  ItemType,
  Length extends number,
  Result extends ItemType[] = [],
> = Result['length'] extends Length ? Result : Tuple<ItemType, Length, [...Result, ItemType]>

export const getSubset = <T extends object>(obj: T, keyArray: Array<keyof T>) => {
  return Object.fromEntries(keyArray.map((k) => [k, obj[k]]))
}

/**
 * @deprecated should not be prefered due to eval overhead
 */
export const valueOrFn = <T, A>(a: A, vof: T | ((a: A) => T)) => {
  if (vof instanceof Function) return vof(a)
  else return vof
}

export const findNearestNumberInArray =
  (sortedArray: number[]) =>
  (item: number, direction: 'r' | 'l' | 'bi' = 'bi'): number => {
    if (sortedArray.length < 2) return item
    if (sortedArray.includes(item)) return item
    const baseIdx = sortedArray.findIndex((arrayItem) => arrayItem >= item)
    const right = sortedArray[baseIdx]
    const left = sortedArray[baseIdx === -1 ? sortedArray.length - 1 : baseIdx - 1]
    if (direction === 'r' && baseIdx !== -1) return right
    if (direction === 'l' && baseIdx !== 0) return left
    if (direction === 'bi') {
      if (left === undefined) return right
      if (right === undefined) return left
      return [right, left].sort((a, b) => Math.abs(item - a) - Math.abs(item - b))[0]
    }
    return item
  }

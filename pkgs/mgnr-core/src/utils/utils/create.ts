export const deepCopy = <O extends Record<string | number | symbol, unknown>>(obj: O) => {
  return JSON.parse(JSON.stringify(obj))
}

export const overrideDefault = <T extends { [k: string]: unknown }>(
  defaults: T,
  values: Partial<T>
): T => {
  Object.keys(values).forEach((k) => {
    if (values[k] === undefined) {
      delete values[k]
    }
  })
  return {
    ...defaults,
    ...values,
  }
}

/**
 * join array using the last item of array as junction
 */
export const concatWithJunction = <T>(a: T[], b: T[]): T[] => {
  if (!a.length) return b
  if (!b.length) return a
  return [...a].concat([...b].slice(1))
}

export const createCombination = <T>(items: T[]): T[][] =>
  items.flatMap((item, i) => items.slice(i + 1).map((another) => [item, another]))

export const splicedArray = <T>(arr: T[], ...args: Parameters<typeof Array.prototype.splice>) => {
  arr.splice(...args)
  return arr
}

export const createCosCurveArray = <T>(
  original: T,
  getVal: (original: T, sinValue: number) => T,
  numOfQueue: number
) => {
  return [...Array(numOfQueue)].map((_, i) =>
    getVal(original, Math.cos((Math.PI / 2) * (i / numOfQueue)))
  )
}
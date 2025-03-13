import { randomIntBetween, randomIntInclusiveBetween } from './value'

export const randomItemFromArray = <T>(array: T[] | readonly T[]): T => {
  if (!array.length) {
    throw Error(`can't get an item from an empty array`)
  }
  return array[randomIntInclusiveBetween(0, array.length - 1)]
}

export const randomItem = <T>(array: T[]): T => array[randomIntBetween(0, array.length)]

export const makeDifferentIntPicker = (min: number, max: number, maxRetry = 100) => {
  let current: number
  const pick = (retry = 0): number => {
    const int = randomIntInclusiveBetween(min, max)
    if (current !== int || retry > maxRetry) {
      current = int
      return current
    }
    return pick(retry + 1)
  }
  return pick
}

export const makeRandomItemPicker = <T>(array: T[]): (() => T) => {
  if (!array.length) {
    throw Error(`can't get an item from an empty array`)
  }
  const getIndex = makeDifferentIntPicker(0, array.length - 1)
  return () => array[getIndex()]
}

/**
 * creates a function that randomly select item with weighted rate
 */
export const makeWeightedRandomPicker = <C>(candidates: [number, C][]) => {
  const candiWithPercentage = mapPercentageThresholds(ratioToPercentage(candidates))
  return () => {
    const r = Math.random()
    const selected = candiWithPercentage.find(([p]) => r <= p)
    return selected![1]
  }
}

export const ratioToPercentage = <C>(candidates: [number, C][]) => {
  const sum = candidates.reduce((prev, [ratio]) => prev + ratio, 0)
  return candidates.map(([ratio, cand]) => [ratio / sum, cand] as [number, C])
}

export const mapPercentageThresholds = <C>(candidates: [number, C][]) => {
  const newCandidates = candidates.slice()
  candidates.reduce((prev, [percentage, _], i) => {
    const accumulated = prev + percentage
    newCandidates[i][0] = accumulated
    return accumulated
  }, 0)
  return newCandidates
}

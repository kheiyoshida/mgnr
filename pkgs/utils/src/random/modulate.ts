import { fireByRate, randomIntBetween, randomIntInclusiveBetween } from './value'

export const makeIntWobbler = (range: number) => (int: number) => {
  return int + randomIntInclusiveBetween(-range, range)
}

export const createShuffledArray = <T>(array: T[]) => {
  const len = Number(array.length)
  return [...Array(len)].map((_, i) => {
    const [s] = array.splice(randomIntBetween(0, len - i), 1)
    return s
  })
}

export const randomRemoveFromArray = <T>(items: T[], removeRate = 0.5) => {
  const [survived, removed]: T[][] = [[], []]
  items.forEach((itm) => {
    fireByRate(removeRate) ? removed.push(itm) : survived.push(itm)
  })
  return [survived, removed]
}

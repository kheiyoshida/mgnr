import Logger from 'js-logger'
import { randomIntInclusiveBetween } from '../random/value'

export type Range = {
  min: number
  max: number
}

export const clamp = (val: number, min: number, max: number) => {
  return Math.min(Math.max(val, min), max)
}

export const clampAnd =
  (val: number, min: number, max: number) => (and: (clamped: number) => void) => {
    const clamped = clamp(val, min, max)
    if (clamped !== val) {
      and(clamped)
    }
  }

export const pickRange = (numOrRange: number | Range) => {
  if (typeof numOrRange === 'number') return numOrRange
  else return randomIntInclusiveBetween(numOrRange.min, numOrRange.max)
}

export const normalizeRange = (rangeValue: number | Range) => {
  if (typeof rangeValue === 'number') return rangeValue
  else return rangeValue.max
}

export class NumRange {
  readonly min!: number
  readonly max!: number

  constructor(r: Range) {
    if (r instanceof NumRange) {
      return r
    }
    if (r.max <= r.min) {
      throw new Error(`NumRange.max must be greater than min`)
    }
    this.min = r.min
    this.max = r.max
  }

  static clamp(
    val: Range,
    limit: Range,
    err = `provided value is out of limit range. it fell back to limit.`
  ) {
    let min = val.min
    let max = val.max
    if (val.min < limit.min) {
      Logger.warn(err, `invalid: ${val.min}`)
      min = limit.min
    }
    if (val.max > limit.max) {
      Logger.warn(err, `invalid: ${val.max}`)
      max = limit.max
    }
    return new NumRange({ min, max })
  }

  public includes(n: number) {
    return this.min <= n && this.max >= n
  }

  public within(range: Range): boolean {
    return !(this.min < range.min || this.max > range.max)
  }

  public eq(range: Range): boolean {
    return this.min == range.min && this.max == range.max
  }
}

export const restrainWithinRange = (val: Range, limit: Range) => {
  return { min: Math.max(val.min, limit.min), max: Math.min(val.max, limit.max) }
}

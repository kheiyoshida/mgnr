import { clamp, clampAnd, normalizeRange, NumRange, pickRange, restrainWithinRange } from './range'
import * as random from '../random/value'

describe(`${clamp.name}`, () => {
  it(`should clamp value to the range`, () => {
    expect(clamp(10, 1, 5)).toBe(5)
  })
})

describe(`${clampAnd.name}`, () => {
  it(`should clamp and exec callback when clamped`, () => {
    const fn = jest.fn()
    clampAnd(10, 1, 5)(fn)
    expect(fn).toHaveBeenCalled()
    const fn2 = jest.fn()
    clampAnd(3, 1, 5)(fn2)
    expect(fn2).not.toHaveBeenCalled()
  })
})

describe(`${pickRange.name}`, () => {
  it(`should get number`, () => {
    expect(pickRange(3)).toBe(3)
  })
  it(`should get randomly from range when it's range`, () => {
    const rand = jest.spyOn(random, 'randomIntInclusiveBetween').mockReturnValue(12)
    expect(pickRange({ min: 10, max: 20 })).toBe(12)
    expect(rand).toHaveBeenCalledWith(10, 20)
  })
})

describe(`${normalizeRange.name}`, () => {
  it(`should get number when it's number`, () => {
    expect(normalizeRange(3)).toBe(3)
  })
  it(`should get the max of range when it's range`, () => {
    expect(normalizeRange({ min: 10, max: 20 })).toBe(20)
  })
})

describe(`${NumRange.name}`, () => {
  it('can judge if a given number is included in the range', () => {
    const range = new NumRange({ min: 40, max: 60 })
    expect(range.includes(50)).toBe(true)
    expect(range.includes(40)).toBe(true)
    expect(range.includes(60)).toBe(true)
    expect(range.includes(39)).toBe(false)
    expect(range.includes(61)).toBe(false)
  })
  it('can judge if another range is within the range', () => {
    const range = new NumRange({ min: 40, max: 60 })
    expect(range.within({ min: 30, max: 80 })).toBe(true)
    expect(range.within({ min: 40, max: 60 })).toBe(true)
    expect(range.within({ min: 41, max: 60 })).toBe(false)
    expect(range.within({ min: 40, max: 59 })).toBe(false)
  })
  it('can take numrange in constructor', () => {
    const r = new NumRange({ min: 40, max: 60 })
    const r2 = new NumRange(r)
    expect(r2).toBe(r)
  })
  it('can judge if another range is equivalent', () => {
    expect(new NumRange({min: 40, max: 60}).eq({min: 40, max: 60})).toBe(true)
    expect(new NumRange({min: 40, max: 60}).eq({min: 40, max: 50})).toBe(false)
    expect(new NumRange({min: 40, max: 60}).eq(new NumRange({min: 40, max: 60}))).toBe(true)
  })
})

describe(`${restrainWithinRange.name}`, () => {
  it(`should restrain range within another`, () => {
    const result = restrainWithinRange({ min: 10, max: 20 }, { min: 5, max: 15 })
    expect(result).toMatchObject({ min: 10, max: 15 })
  })
})

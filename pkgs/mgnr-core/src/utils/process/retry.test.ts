import { retry } from './retry'

const randInt = (n: number): number => {
  return Math.round(n * Math.random())
}

export const tuple = <T extends any[]>(...data: T) => data

describe(`retry`, () => {
  it(`should retry function`, () => {
    const fn = jest.fn().mockImplementation((n) => randInt(n))
    const f = retry(
      fn,
      (r) => r > 10,
      100,
      'exceeded',
      (n) => tuple(n + 1)
    )
    expect(f(1)).toBeGreaterThan(10)
    expect(fn.mock.calls.slice(0, 10)).toMatchObject([
      [1],
      [2],
      [3],
      [4],
      [5],
      [6],
      [7],
      [8],
      [9],
      [10],
    ])
  })
  it(`should not retry exceeding max retry times`, () => {
    const fn = jest.fn().mockImplementation((n) => randInt(n))
    const f = retry(
      fn,
      (r) => r > 50,
      20,
      'exceeded',
      (n) => tuple(n + 1)
    )
    expect(() => f(1)).toThrow('exceeded')
    expect(fn).toHaveBeenCalledTimes(20)
  })
})

import { pipe, once, memorize } from './function'

test(`${pipe.name}`, () => {
  expect(
    pipe(
      1,
      (n: number) => n + 1,
      (n: number) => Math.pow(n, 2)
    )
  ).toBe(4)
})

test(`${once.name}`, () => {
  const fn = jest.fn()
  const onceFunc = once(fn)
  expect(fn).not.toHaveBeenCalled()
  onceFunc()
  expect(fn).toHaveBeenCalledTimes(1)
  expect(() => onceFunc()).toThrow()
})

test(`${memorize.name}`, () => {
  const calculation = jest.fn().mockImplementation((n: number) => Math.pow(n, 2))
  const memoCalc = memorize(calculation)
  expect(calculation).not.toHaveBeenCalled()
  expect(memoCalc(2)).toBe(4)
  expect(calculation).toHaveBeenCalledTimes(1)
  expect(memoCalc(2)).toBe(4)
  expect(calculation).toHaveBeenCalledTimes(1)
  expect(memoCalc(3)).toBe(4) // doesn't accept new args
  expect(calculation).toHaveBeenCalledTimes(1)
})
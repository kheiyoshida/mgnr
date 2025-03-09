import { compareTuples, loop, negateIf } from "./logical";

test(`${compareTuples.name}`, () => {
  expect(compareTuples([0, 1], [0, 1])).toBe(true)
  expect(compareTuples([0, 1], [1, 0])).toBe(true)
  expect(compareTuples([0, 1], [0, 0])).toBe(false)
  expect(compareTuples([0, 1], [1, 1])).toBe(false)
})

test(`${negateIf.name}`, () => {
  expect(negateIf(true, true)).toBe(false)
  expect(negateIf(true, false)).toBe(true)
  expect(negateIf(false, true)).toBe(true)
  expect(negateIf(false, false)).toBe(false)
})

test(`${loop.name}`, () => {
  const fn = jest.fn()
  loop(3, fn)
  expect(fn).toHaveBeenCalledTimes(3)
})
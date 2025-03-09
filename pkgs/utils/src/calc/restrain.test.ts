import { makeCycle, makeNormalizeValueInRange } from './restrain'

test.each([
  [14, 4],
  [-3, 7],
  [10, 0]
])(`${makeCycle.name} %i -> %i`, (value, expected) => {
  const cycle10 = makeCycle(10)
  expect(cycle10(value)).toBe(expected)
})

test(`${makeNormalizeValueInRange.name}`, () => {
  const normalizeRange = makeNormalizeValueInRange(0.4, 1)
  expect(normalizeRange(0)).toBeCloseTo(0)
  expect(normalizeRange(0.4)).toBeCloseTo(0)
  expect(normalizeRange(0.7)).toBeCloseTo(0.5)
  expect(normalizeRange(1)).toBeCloseTo(1)
  expect(normalizeRange(1.2)).toBeCloseTo(1)
})

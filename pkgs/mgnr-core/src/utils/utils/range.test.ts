import { makeRangeMap } from './range'

test(`${makeRangeMap.name}`, () => {
  const rangeMap = makeRangeMap([
    [
      [0, 1],
      'range1',
    ],
    [
      [2, 5],
      'range2',
    ],
  ])

  expect(rangeMap.get(0)).toBe('range1')
  expect(rangeMap.get(1)).toBe('range1')
  expect(rangeMap.get(2)).toBe('range2')
  expect(rangeMap.get(3)).toBe('range2')
  expect(rangeMap.get(4)).toBe('range2')
  expect(rangeMap.get(5)).toBe('range2')
  expect(rangeMap.get(6)).toBe('range2') // fallback
})

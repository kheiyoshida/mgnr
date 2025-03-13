import { reducePosition, validatePosition } from './position'

test(`${reducePosition.name}`, () => {
  expect(reducePosition([100, 100], [200, 200])).toMatchObject([300, 300])
})

test(`${validatePosition.name}`, () => {
  expect(validatePosition([-1, 4], { min: 0, max: 4 })).toBeNull()
  expect(validatePosition([1, 6], { min: 0, max: 4 })).toBeNull()
  expect(validatePosition([1, 3], { min: 0, max: 4 })).toMatchObject([1, 3])
})

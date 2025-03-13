import { findNearestNumberInArray, getSubset, valueOrFn } from './get'

test(`${getSubset.name}`, () => {
  const obj = {
    a: 1,
    b: 2,
    c: 3,
  }
  expect(getSubset(obj, ['a', 'c'])).toMatchObject({
    a: 1,
    c: 3,
  })
})

test(`${valueOrFn.name}`, () => {
  const circle = {
    r: 3,
  }
  expect(valueOrFn(circle, (c) => c.r)).toBe(3)
  expect(valueOrFn(circle, 3.14)).toBe(3.14)
})

describe(`${findNearestNumberInArray.name}`, () => {
  it(`should return item itself when array has only 1 item`, () => {
    expect(findNearestNumberInArray([1])(1)).toBe(1)
  })
  it(`should return item itself when item is included in array`, () => {
    const findNearest = findNearestNumberInArray([1, 2, 3])
    expect(findNearest(2, 'r')).toBe(2)
    expect(findNearest(2, 'l')).toBe(2)
    expect(findNearest(2, 'bi')).toBe(2)
  })
  it(`should find the nearest item from the given item in an array`, () => {
    const findNearest = findNearestNumberInArray([1, 3, 5, 8])
    expect(findNearest(4, 'r')).toBe(5)
    expect(findNearest(4, 'l')).toBe(3)
    expect(findNearest(-1, 'r')).toBe(1)
    expect(findNearest(10, 'l')).toBe(8)
  })
  it(`should find the nearest from both direction`, () => {
    const findNearest = findNearestNumberInArray([0, 2, 5, 8])
    expect(findNearest(3)).toBe(2)
    expect(findNearest(4)).toBe(5)
    expect(findNearest(1)).toBe(2)
    expect(findNearest(-1)).toBe(0)
    expect(findNearest(10)).toBe(8)
  })
})

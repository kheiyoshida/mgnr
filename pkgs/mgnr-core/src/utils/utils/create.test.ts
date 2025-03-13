import {
  concatWithJunction,
  createCombination,
  deepCopy,
  createCosCurveArray,
  overrideDefault,
  splicedArray,
} from './create'

test(`${deepCopy.name}`, () => {
  const original = { name: 'john', age: 20 }
  const result = deepCopy(original)
  expect(original === result).not.toBe(true)
})

test(`${overrideDefault.name}`, () => {
  const defaultObj: { name: string; age: number; address?: string } = {
    name: 'john',
    age: 20,
    address: 'somewhere',
  }
  const result = overrideDefault(defaultObj, { name: 'myao', address: undefined })
  expect(result).toMatchObject({
    name: 'myao',
    age: 20,
    address: 'somewhere',
  })
})

describe(`${concatWithJunction.name}`, () => {
  it(`should concat two arrays using the last item of first`, () => {
    const a = ['c', 'o', 'n', 'c']
    const b = ['c', 'a', 't']
    expect(concatWithJunction(a, b)).toMatchObject(['c', 'o', 'n', 'c', 'a', 't'])
  })
  it(`should just retun if one is empty`, () => {
    const array = ['a', 'b', 'c']
    expect(concatWithJunction(array, [])).toMatchObject(array)
    expect(concatWithJunction([], array)).toMatchObject(array)
  })
})

test(`${createCombination.name}`, () => {
  expect(createCombination(['a', 'b', 'c'])).toMatchObject([
    ['a', 'b'],
    ['a', 'c'],
    ['b', 'c'],
  ])
})

test(`${splicedArray.name}`, () => {
  expect(splicedArray([1, 2, 3], 1, 1)).toMatchObject([1, 3])
})

test(`${createCosCurveArray.name}`, () => {
  const res = createCosCurveArray(1, (val, sv) => val * sv, 12)
  expect(res).toMatchInlineSnapshot(`
    [
      1,
      0.9914448613738104,
      0.9659258262890683,
      0.9238795325112867,
      0.8660254037844387,
      0.7933533402912352,
      0.7071067811865476,
      0.6087614290087207,
      0.5000000000000001,
      0.38268343236508984,
      0.25881904510252074,
      0.1305261922200517,
    ]
  `)
})

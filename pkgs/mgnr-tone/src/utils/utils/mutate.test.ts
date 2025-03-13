import { removeItemFromArray } from './mutate'

describe(`${removeItemFromArray.name}`, () => {
  it(`should find and remove item from array`, () => {
    const array = ['foo', 'bar', 'myao']
    removeItemFromArray(array, 'foo')
    expect(array).toMatchObject(['bar', 'myao'])
  })
  it(`should throw when empty array given`, () => {
    expect(() => removeItemFromArray([], 'foo')).toThrow()
  })
})

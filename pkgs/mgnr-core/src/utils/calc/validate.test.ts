import { validateInt } from './validate'

describe(`${validateInt.name}`, () => {
  it(`should throw when invalid int passed`, () => {
    expect(() => validateInt(0.5)).toThrow()
    expect(() => validateInt(2)).not.toThrow()
  })
})

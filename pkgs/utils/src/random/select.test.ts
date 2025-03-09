import {
  makeWeightedRandomPicker,
  makeDifferentIntPicker,
  makeRandomItemPicker,
  randomItemFromArray,
  randomItem,
  ratioToPercentage,
  mapPercentageThresholds,
} from './select'

describe(`${randomItemFromArray.name}`, () => {
  it(`should get random item from an array`, () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.999)
    const arr = ['a', 'b', 'c']
    expect(randomItemFromArray(arr)).toBe('a')
    expect(randomItemFromArray(arr)).toBe('b')
    expect(randomItemFromArray(arr)).toBe('c')
  })
})

describe(`${makeDifferentIntPicker.name}`, () => {
  it(`should always pick different int from range`, () => {
    const picker = makeDifferentIntPicker(0, 10)
    let prev: number
    ;[...Array(30)].map(() => {
      const int = picker()
      expect(int).not.toBe(prev)
      prev = int
    })
  })
})

describe(`${makeRandomItemPicker.name}`, () => {
  it(`should always pick different item of an array`, () => {
    const itemPicker = makeRandomItemPicker(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])
    let prev = ''
    ;[...Array(10)].map(() => {
      const result = itemPicker()
      expect(result).not.toBe(prev)
      prev = result
    })
  })
})

describe(`${randomItem.name}`, () => {
  it(`should get random item from array`, () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.8)
    expect(randomItem(['a', 'b', 'c'])).toBe('c')
  })
})

describe(`${makeWeightedRandomPicker.name}`, () => {
  it(`can make a random picker with candidates and their ratio`, () => {
    const randomPicker = makeWeightedRandomPicker<string>([
      [3, 'A'],
      [2, 'B'],
      [5, 'C'],
    ])
    const mathRandom = jest.spyOn(Math, 'random')
    mathRandom.mockReturnValue(0.2)
    expect(randomPicker()).toBe('A')

    const randomPicker2 = makeWeightedRandomPicker([
      [30, 'A'],
      [18, 'B'],
      [60, 'C'],
    ])
    mathRandom.mockReturnValue(1)
    expect(randomPicker2()).toBe('C')
  })

  it(`can turn ratio to pecentage`, () => {
    expect(
      ratioToPercentage([
        [3, 'A'],
        [2, 'B'],
        [5, 'C'],
      ])
    ).toMatchObject([
      [0.3, 'A'],
      [0.2, 'B'],
      [0.5, 'C'],
    ])
  })
  it(`can turn percentages to mapped pecentages`, () => {
    expect(
      mapPercentageThresholds([
        [0.3, 'A'],
        [0.2, 'B'],
        [0.5, 'C'],
      ])
    ).toMatchObject([
      [0.3, 'A'],
      [0.5, 'B'],
      [1.0, 'C'],
    ])
  })
})

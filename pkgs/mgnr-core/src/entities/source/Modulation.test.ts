import { Helpers, Modulation } from './Modulation'

describe(`${Modulation.name}`, () => {
  describe(`construct modulation process`, () => {
    it(`should remove notes first, then add the replacement (if any)`, () => {
      const mod = Modulation.create(
        {
          key: 'C',
          pref: 'major',
          range: { min: 60, max: 72 },
        },
        {
          key: 'F',
          pref: 'major',
          range: { min: 60, max: 72 },
        },
        2
      )
      expect(mod).toBeDefined()
      expect(mod!.queue).toMatchObject([
        {
          remove: [11],
        },
        {
          add: [10],
        },
      ])
      expect(mod!.degreesInNextScaleType).toMatchObject([0, 2, 4, 5, 7, 9, 11])

      mod!.next()
      expect(mod!.degreesInNextScaleType).toMatchObject([0, 2, 4, 5, 7, 9])
      expect(mod!.queue).toMatchObject([{ add: [10] }])

      mod!.next()
      expect(mod!.degreesInNextScaleType).toMatchObject([0, 2, 4, 5, 7, 9, 10])
      expect(mod!.queue).toMatchObject([])
    })
    it(`should cancel modulation if there's no diff`, () => {
      const mod = Modulation.create(
        {
          key: 'C',
          pref: 'omit27',
          range: { min: 60, max: 72 },
        },
        {
          key: 'F',
          pref: 'omit46',
          range: { min: 60, max: 72 },
        },
        2
      )
      expect(mod).toBe(undefined)
    })
    it(`should consume another queue if degreeList gets empty`, () => {
      const mod = Modulation.create(
        {
          key: 'C',
          pref: '_1M',
          range: { min: 60, max: 67 },
        },
        { key: 'D', pref: '_1M', range: { min: 60, max: 67 } },
        6
      )
      expect(mod).not.toBe(undefined)
      expect(mod!.degreesInNextScaleType).toMatchObject([0, 4, 7])
      expect(mod!.queue).toMatchObject([
        {
          remove: [7],
        },
        {
          remove: [4],
        },
        {
          remove: [0], // when scale gets empty
        },
        {
          add: [9],
        },
        {
          add: [6],
        },
        {
          add: [2],
        },
      ])

      mod!.next()
      expect(mod!.queue).toHaveLength(5)
      mod!.next()
      expect(mod!.queue).toHaveLength(4)

      // gets empty
      mod!.next()
      expect(mod!.queue).not.toHaveLength(3)
      expect(mod!.queue).toHaveLength(2)

      mod!.next()
      expect(mod!.queue).toHaveLength(1)
      mod!.next()
      expect(mod!.queue).toHaveLength(0)
    })
  })
})

describe('Helpers', () => {
  describe('constructModulationQueue', () => {
    const Cmajor = [0, 2, 4, 5, 7, 9, 11]
    const Dmajor = [1, 2, 4, 6, 7, 9, 11]
    it(`should return modulation queue`, () => {
      const res = Helpers.constructModulationQueue(Cmajor, Dmajor, 2)
      expect(res).toMatchObject([
        {
          remove: [5, 0],
        },
        {
          add: [6, 1],
        },
      ])
      const res2 = Helpers.constructModulationQueue(Cmajor, Dmajor, 3)
      expect(res2).toMatchObject([
        {
          remove: [5, 0],
        },
        {
          add: [6, 1],
        },
      ])
      const res3 = Helpers.constructModulationQueue(Cmajor, Dmajor, 4)
      expect(res3).toMatchObject([
        {
          remove: [5],
        },
        {
          remove: [0],
        },
        {
          add: [6],
        },
        {
          add: [1],
        },
      ])
    })
  })
})

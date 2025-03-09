import { makeStoreV2 } from '.'

type TestState = { fieldA: string; arr: number[] }

describe(`${makeStoreV2.name}`, () => {
  it(`can store state and operate reducers`, () => {
    const store = makeStoreV2<TestState>({ fieldA: 'yeah', arr: [1, 2, 3] })({
      updateField: (state) => (val: string) => {
        state.fieldA = val
      },
      pushNumber: (state) => (num: number) => {
        state.arr.push(num)
      },
      pushNumbers: (state) => (nums: number[]) => {
        state.arr = state.arr.concat(nums)
      },
    })

    expect(store.current.fieldA).toBe('yeah')

    store.updateField('something else')
    expect(store.current.fieldA).not.toBe('yeah')

    store.pushNumber(4)
    expect(store.current.arr).toMatchObject([1, 2, 3, 4])

    store.pushNumbers([5, 6])
    expect(store.current.arr).toMatchObject([1, 2, 3, 4, 5, 6])
  })
  it(`can lazily init the state using the given initializer`, () => {
    const initialState = { fieldA: 'lazy', arr: [] }
    const store = makeStoreV2<TestState>(() => initialState)({})
    expect(() => store.current).toThrow()
    store.lazyInit()
    expect(store.current).toMatchObject(initialState)
  })
})

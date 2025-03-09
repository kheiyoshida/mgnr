import { makeStore } from './store'

describe(`${makeStore.name}`, () => {
  type StoreType = {
    foo: string
    bar: number
  }
  const initial = {
    foo: 'foo',
    bar: 2,
  }
  const intialize = () => {
    const store = makeStore<StoreType>()
    store.init(initial)
    return store
  }
  it(`can init with initialValue`, () => {
    const store = intialize()
    expect(store.read()).toMatchObject(initial)
  })
  it(`can update a single field`, () => {
    const store = intialize()
    store.update('foo', 'foobarmyao')
    expect(store.read('foo')).toBe('foobarmyao')
  })
  it(`can update with an updater function`, () => {
    const store = intialize()
    store.update('bar', (n) => n * 2)
    expect(store.read('bar')).toBe(4)
  })
  it(`can update multiple fields`, () => {
    const store = intialize()
    const newData = {
      foo: 'berabera',
      bar: 20,
    }
    store.bulkUpdate(newData)
    expect(store.read()).toMatchObject(newData)
  })
})

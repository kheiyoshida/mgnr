import { delay, makeDelayedFn } from './delay'

const flushPromises = () => new Promise(jest.requireActual('timers').setImmediate)

beforeEach(()=>{
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

test(`${delay.name}`, async () => {
  const fn = jest.fn()
  delay(1000).then(fn)

  expect(fn).not.toHaveBeenCalled()

  jest.runAllTimers()
  await flushPromises()
  expect(fn).toHaveBeenCalled()
})

test(`${makeDelayedFn.name}`, async () => {
  const fn = jest.fn()
  const delayedFn = makeDelayedFn(1000, fn)

  delayedFn()
  expect(fn).not.toHaveBeenCalled()

  jest.runAllTimers()
  await flushPromises()
  expect(fn).toHaveBeenCalled()
})


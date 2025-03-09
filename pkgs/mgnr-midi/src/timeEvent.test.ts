import { scheduleRepeat } from "./timeEvent";

test(`${scheduleRepeat.name}`, () => {
  jest.useFakeTimers()
  const fn = jest.fn()
  scheduleRepeat(2000, 4, (repeat) => fn(repeat))
  
  jest.advanceTimersByTime(0)
  expect(fn).toHaveBeenCalledTimes(1)
  expect(fn).toHaveBeenLastCalledWith(0)
  jest.advanceTimersByTime(2000)
  expect(fn).toHaveBeenCalledTimes(2)
  expect(fn).toHaveBeenLastCalledWith(1)
  jest.advanceTimersByTime(2000)
  expect(fn).toHaveBeenCalledTimes(3)
  expect(fn).toHaveBeenLastCalledWith(2)
})
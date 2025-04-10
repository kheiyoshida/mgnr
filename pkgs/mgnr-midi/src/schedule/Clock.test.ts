import { Clock } from './Clock'

describe(`${Clock.name}`, () => {
  beforeEach(() => jest.useFakeTimers())
  afterAll(jest.useRealTimers)

  it(`ticks every 16th note depending on the bpm`, () => {
    const tickCallback = jest.fn()
    const clock = new Clock(tickCallback)
    clock.bpm = 120

    clock.start()

    jest.advanceTimersByTime(125) // 16th note in bpm 120
    expect(tickCallback).toHaveBeenCalledTimes(1)
    expect(clock.currentTime.index).toBe(1)

    jest.advanceTimersByTime(20)
    expect(tickCallback).toHaveBeenCalledTimes(1)
    expect(clock.currentTime.index).toBe(1)

    jest.advanceTimersByTime(105)
    expect(tickCallback).toHaveBeenCalledTimes(2)
    expect(clock.currentTime.index).toBe(2)

    jest.advanceTimersByTime(125)
    expect(tickCallback).toHaveBeenCalledTimes(3)
    expect(clock.currentTime.index).toBe(3)
  })
  it.todo(`adjusts tick intervals accordingly when set different bpm`)
})

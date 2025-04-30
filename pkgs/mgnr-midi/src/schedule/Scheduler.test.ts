import { Scheduler } from './Scheduler'
import { Time } from './Time'

describe(`${Scheduler.name}`, () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => {
    Scheduler.dispose()
    jest.useRealTimers()
  })

  it(`can schedule events specifying the firing timing, and the event fires at the specified time`, () => {
    const scheduler = Scheduler.get()
    const eventCallback = jest.fn()

    scheduler.scheduleEvent({callback: eventCallback, time: new Time(2)})
    scheduler.start()

    jest.advanceTimersByTime(Time.unitInMillis)
    expect(eventCallback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis) // 2
    expect(eventCallback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(Time.unitInMillis) // 3
    expect(eventCallback).toHaveBeenCalledTimes(1)
  })

  it(`can set a window between callbacks at a time`, () => {
    const scheduler = Scheduler.get()
    const eventCallback = jest.fn()

    // set window
    Scheduler.multiEventsBufferInterval = 2

    // 3 callbacks at a time
    scheduler.scheduleEvent({callback: eventCallback, time: new Time(2)})
    scheduler.scheduleEvent({callback: eventCallback, time: new Time(2)})
    scheduler.scheduleEvent({callback: eventCallback, time: new Time(2)})
    scheduler.start()

    jest.advanceTimersByTime(Time.unitInMillis) // 1
    expect(eventCallback).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis) // 2
    expect(eventCallback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1)
    expect(eventCallback).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1) // Time:2 + 2ms
    expect(eventCallback).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(2) // Time:2 + 2ms * 2
    expect(eventCallback).toHaveBeenCalledTimes(3)
  })
})

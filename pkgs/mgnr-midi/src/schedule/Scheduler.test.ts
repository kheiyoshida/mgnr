import { Scheduler } from './Scheduler'
import { Time } from './Time'

describe(`${Scheduler.name}`, () => {
  beforeEach(() => jest.useFakeTimers())
  afterAll(jest.useRealTimers)

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
})

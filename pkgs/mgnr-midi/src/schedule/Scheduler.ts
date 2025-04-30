import { ScheduledEvent } from './Event'
import { Clock } from './Clock'
import { Time } from './Time'

export class Scheduler {
  static #singleton?: Scheduler

  #events: Record<number, (() => void)[]> = {}

  scheduleEvent(event: ScheduledEvent) {
    if (event.time.index in this.#events) {
      this.#events[event.time.index].push(event.callback)
    } else {
      this.#events[event.time.index] = [event.callback]
    }
  }

  #clock: Clock

  private constructor() {
    this.#clock = new Clock(this.#fireEventsAtTime.bind(this))
  }

  get currentTime(): Time {
    return this.#clock.currentTime
  }

  /**
   * get singleton for Scheduler
   */
  static get(): Scheduler {
    if (!Scheduler.#singleton) {
      Scheduler.#singleton = new Scheduler()
    }
    return Scheduler.#singleton
  }

  start() {
    this.#clock.start()
  }

  /**
   * it sets a small window between events
   * so that multiple midi messages won't come to the source at the same time.
   *
   * set this in milliseconds when audio stops briefly (means temporary CPU spike)
   *
   * TODO: consider implementing with requestAnimationFrame
   */
  static multiEventsBufferInterval = 0

  #fireEventsAtTime() {
    const eventCallbacks = this.#events[this.#clock.currentTime.index]
    if (!eventCallbacks) return
    if (Scheduler.multiEventsBufferInterval) {
      eventCallbacks.forEach((cb, i) => {
        if (i === 0) cb()
        else setTimeout(() => cb(), i * Scheduler.multiEventsBufferInterval)
      })
    } else eventCallbacks.forEach((cb) => cb())
  }

  static dispose() {
    Scheduler.#singleton = undefined
  }
}

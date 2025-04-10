import { ScheduledEvent } from './Event'
import { Clock } from './Clock'
import { Time } from './Time'

export class Scheduler {
  static #singleton: Scheduler

  #events: Record<number, (() => void)[]> = {}

  scheduleEvent(event: ScheduledEvent) {
    if(event.time.index in this.#events) {
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

  #fireEventsAtTime() {
    const eventCallbacks = this.#events[this.#clock.currentTime.index]
    if (!eventCallbacks) return
    eventCallbacks.forEach(cb => cb())
  }
}

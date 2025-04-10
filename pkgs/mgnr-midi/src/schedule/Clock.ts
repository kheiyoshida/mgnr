import { Time } from './Time'

export class Clock {
  set bpm(value: number) {
    Time.bpm = value
  }

  #currentTime: Time
  get currentTime(): Time {
    return this.#currentTime
  }

  readonly #tickCallback: () => void

  constructor(tickCallback: () => void) {
    this.#tickCallback = tickCallback
    this.#currentTime = new Time(0)
  }

  start() {
    this.#loop()
  }

  #loop() {
    // TODO: consider implementing ticking independently for more precision
    setTimeout(() => {
      this.#currentTime.index += 1
      this.#tickCallback()
      this.#loop()
    }, Time.unitInMillis)
  }
}

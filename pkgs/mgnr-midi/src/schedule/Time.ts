
export class Time {
  static bpm = 120

  static readonly unit = 16

  #index = 0

  /**
   * nth unit since the beginning.
   * by default, it counts the number of 16th-note equivalent ticks count since the clock start
   */
  get index() {
    return this.#index
  }
  set index(value: number) {
    this.#index = value
  }

  constructor(index: number) {
    this.#index = index
  }

  // TODO: maybe implement bar-beat-ticks conversion?

  static get measureInSecs() {
    return 4 * 60 / Time.bpm
  }
  static get unitInSecs() {
    return Time.measureInSecs / Time.unit
  }

  static get measureInMillis() {
    return 4 * 60_000 / Time.bpm
  }
  static get unitInMillis() {
    return Time.measureInMillis / Time.unit
  }

  toSeconds(): number {
    return this.#index * Time.unitInSecs
  }
  toMillis(): number {
    return this.#index * Time.unitInMillis
  }

  add(unit: number): Time {
    return new Time(this.index + unit)
  }
}

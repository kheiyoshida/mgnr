import { findNearestNumberInArray, randomItemFromArray, Range } from 'utils'
import { MidiNum, PitchName, ROOT_TONE_MAP } from '../index'
import { ScaleType } from './scaleTypes'
import { Modulation } from './Modulation'
import { constructScalePitches, constructScalePitchesFromConf } from './construct'
import {
  EmptyScaleError,
  validateModResult,
  validateModulationConf,
  validateScalePitches,
  validateScaleRange,
} from './validate'

export interface ScaleConf {
  key: PitchName
  pref: ScaleType
  range: Range
}

export type ScaleArgs = Partial<ScaleConf>

export class Scale {
  protected _conf!: ScaleConf

  get key(): PitchName {
    return this._conf.key
  }

  get scaleType(): ScaleType {
    return this._conf.pref
  }

  /**
   * possible pitches in the current key.
   * typically use this for harmonizer
   */
  get wholePitches() {
    return this._wholePitches
  }

  private _wholePitches!: MidiNum[]

  /**
   * ranged pitches in the whole pitches.
   * client picks pitches from this pool
   */
  get primaryPitches(): MidiNum[] {
    return this._primaryPitches
  }

  private _primaryPitches!: MidiNum[]

  /**
   * suggests that scale has no pitches
   * (typically temporarily during modulation)
   */
  get isEmpty(): boolean {
    return this._primaryPitches.length === 0
  }

  /**
   * range of the pitches for primaryPitches
   */
  get pitchRange(): Range {
    return this._conf.range
  }

  /**
   * root tone midi number
   */
  get lowestPitch(): MidiNum {
    return ROOT_TONE_MAP[this.key]
  }

  private _disposed = false

  get isDisposed() {
    return this._disposed
  }

  dispose() {
    this._disposed = true
  }

  static DefaultValue: ScaleConf = {
    key: 'C',
    range: { min: 24, max: 120 },
    pref: 'major',
  }

  private buildConf(values: ScaleArgs): ScaleConf {
    const fallback = this._conf || Scale.DefaultValue
    return {
      key: values.key || fallback.key,
      pref: values.pref || fallback.pref,
      range: validateScaleRange(values.range || fallback.range),
    }
  }

  constructor(fixedPitches: MidiNum[])
  constructor(config?: Partial<ScaleConf>)
  constructor(values: Partial<ScaleConf> | MidiNum[] = {}) {
    if (Array.isArray(values)) {
      this.setNewValues(values, values, Scale.DefaultValue)
      return
    }
    const conf = this.buildConf(values)
    const result = constructScalePitchesFromConf(conf)
    validateScalePitches(result, conf)
    this.setNewValues(result.wholePitches, result.primaryPitches, conf)
  }

  private setNewValues(wholePitches: MidiNum[], primaryPitches: MidiNum[], conf: ScaleConf) {
    this._conf = conf
    this._wholePitches = wholePitches
    this._primaryPitches = primaryPitches
  }

  public pickRandomPitch(): MidiNum | undefined {
    return randomItemFromArray(this.primaryPitches)
  }

  public pickNearestPitch(pitch: MidiNum, dir: 'up' | 'down' | 'bi' = 'bi'): MidiNum {
    const findNearest = findNearestNumberInArray(this.primaryPitches)
    return findNearest(pitch, dir === 'up' ? 'r' : dir === 'down' ? 'l' : 'bi')
  }

  //-------------------
  // Modulation
  //-------------------

  private _modulation?: Modulation | undefined

  get inModulation(): boolean {
    return this._modulation !== undefined
  }

  /**
   * modulate scale musically.
   * it compares current scale and desired scale and gradually shift towards it
   *
   * @param values config for the next destination scale
   * @param stages number of swap iterations to complete the transition
   */
  public modulate(values?: Partial<ScaleConf>, stages = 0): void {
    if (!this._modulation) {
      if (!values) return
      this.initiateModulation(values, stages)
    } else {
      this.actualModulation(this._modulation)
    }
  }

  private initiateModulation(values: Partial<ScaleConf>, stages = 0) {
    const conf = this.buildConf(values)
    if (stages < 2) return this.modulateImmediately(conf)
    if (!validateModulationConf(conf)) return
    this._modulation = Modulation.create(this._conf, conf, stages)
    if (!this._modulation) return this.endModulation(conf)
    this.modulate()
  }

  private actualModulation(modulation: Modulation): void {
    const nextDegreeList = modulation.next()
    const result = constructScalePitches(nextDegreeList, this.lowestPitch, this.pitchRange)
    const scaleIsNotEmpty = validateModResult(result, modulation)
    if (!scaleIsNotEmpty) {
      if (modulation.queue.length) return this.actualModulation(modulation)
      else return this.abortModulation()
    }
    this.setNewValues(result.wholePitches, result.primaryPitches, this._conf)
    if (modulation.queue.length === 0) {
      this.endModulation(modulation.nextScaleConf)
    }
  }

  private abortModulation() {
    this._modulation = undefined
    this.modulateImmediately(this._conf)
  }

  private modulateImmediately(conf: ScaleConf) {
    try {
      const { wholePitches, primaryPitches } = constructScalePitchesFromConf(conf)
      validateScalePitches({ wholePitches, primaryPitches }, conf)
      this.setNewValues(wholePitches, primaryPitches, conf)
    } catch (e) {
      if (e instanceof EmptyScaleError) return
      throw e
    }
  }

  private endModulation(conf: ScaleConf) {
    this._conf = conf
    this._modulation = undefined
  }
}

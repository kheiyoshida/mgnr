import { NumRange, Range } from 'utils'
import { HIGHEST_MIDI_NUM, LOWEST_MIDI_NUM } from '../index'
import { Modulation } from './Modulation'
import { ScaleConf } from './Scale'
import { constructScalePitches, constructScalePitchesFromConf } from './construct'

export class EmptyScaleError extends Error {
  constructor(config: ScaleConf) {
    super(`unexpected empty scale. Is the new config valid?: ${JSON.stringify(config, null, 2)}`)
  }
}

export function validateScalePitches(
  result: ReturnType<typeof constructScalePitches>,
  conf: ScaleConf
): void {
  if (result.wholePitches.length === 0 || result.primaryPitches.length === 0) {
    throw new EmptyScaleError(conf)
  }
}

export function validateModulationConf(conf: ScaleConf): boolean {
  try {
    const result = constructScalePitchesFromConf(conf)
    validateScalePitches(result, conf)
    return true
  } catch (e) {
    if (e instanceof EmptyScaleError) return false
    throw e
  }
}

export function validateModResult(
  result: ReturnType<typeof constructScalePitches>,
  mod: Modulation
): boolean {
  try {
    validateScalePitches(result, mod.nextScaleConf)
    return true
  } catch (e) {
    if (e instanceof EmptyScaleError) return false
    throw e
  }
}

export function validateScaleRange(range: Range): NumRange {
  return NumRange.clamp(
    range,
    {
      min: LOWEST_MIDI_NUM,
      max: HIGHEST_MIDI_NUM,
    },
    `Scale.range should be between ${LOWEST_MIDI_NUM} - ${HIGHEST_MIDI_NUM}`
  )
}

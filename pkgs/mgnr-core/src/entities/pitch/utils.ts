import { randomItemFromArray } from 'utils'
import { Degree, DEGREE_NUM_MAP, PITCH_NAMES, PitchName, Semitone } from './constants'

export function nthDegreeTone(root: PitchName, degree: Degree): PitchName {
  const degreeInSemitone = DEGREE_NUM_MAP[degree]
  const rootInSemitone = PITCH_NAMES.indexOf(root)
  return PITCH_NAMES[(rootInSemitone + degreeInSemitone) % 12]
}

export function getSemitoneDiffBetweenPitches(root: PitchName, compare: PitchName): Semitone {
  const [ri, ci] = [PITCH_NAMES.indexOf(root), PITCH_NAMES.indexOf(compare)]
  return (ci - ri + 12) % 12
}

export function pickRandomPitchName() {
  return randomItemFromArray(PITCH_NAMES)
}

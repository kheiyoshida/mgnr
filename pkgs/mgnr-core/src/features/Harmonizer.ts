import { overrideDefault } from 'utils'
import { convertDegreeToSemitone, Degree, MidiNum, Note, OCTAVE, Semitone } from '../entities'

export type HarmonizerConf = {
  degree: (Degree | Semitone)[]
  force: boolean
  lookDown: boolean
}

const getDefaultConf = () => ({
  degree: [],
  force: false,
  lookDown: false,
})

export function harmonize(
  note: Note,
  wholePitches: Semitone[],
  conf: Partial<HarmonizerConf>
): Note[] {
  const fullConf = overrideDefault(getDefaultConf(), conf)
  if (note.pitch === 'random') return []
  return fullConf.degree
    .map((d) =>
      getHarmonicPitch(fullConf, note.pitch as number, convertDegreeToSemitone(d), wholePitches)
    )
    .filter((n): n is number => n !== null)
    .map((harmonicPitch) => ({ ...note, pitch: harmonicPitch }))
}

export const getHarmonicPitch = (
  conf: HarmonizerConf,
  originalPitch: Semitone,
  distance: Semitone,
  pitches: Semitone[]
): number | null => {
  if (conf.force) return getPitchInDistance(originalPitch, distance, conf.lookDown)
  else return lookupHarmonicPitch(originalPitch, distance, pitches, conf.lookDown)
}

function lookupHarmonicPitch(
  rootPitch: number,
  degree: Semitone,
  pitches: Semitone[],
  lookDown: boolean,
  r = 0
): MidiNum | null {
  if (r > OCTAVE) return null
  const p = getPitchInDistance(rootPitch, degree, lookDown)
  if (pitches.includes(p)) return p
  else return lookupHarmonicPitch(rootPitch, degree + 1, pitches, lookDown, r + 1)
}

function getPitchInDistance(pitch: MidiNum, distance: Semitone, lookDown: boolean) {
  return pitch + (lookDown ? -distance : distance)
}

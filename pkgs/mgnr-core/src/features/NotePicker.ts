import { overrideDefault, pickRange, Range } from 'utils'
import { harmonize, HarmonizerConf } from './Harmonizer'
import { Note, Scale } from '../entities'

type VelocityConf = {
  velocity: number | Range
  veloPref: 'randomPerEach' | 'consistent'
}

type DurationConf = {
  duration: number | Range
  durationStrategy: 'randomInRange' | 'fixed'
}

type PitchConf = {
  pitchStrategy: 'randomPerLoop' | 'fixed'
  harmonizer?: Partial<HarmonizerConf>
}

export type NotePickerConf = VelocityConf & DurationConf & PitchConf

export const fillNoteConf = (provided: Partial<NotePickerConf>): NotePickerConf => {
  return overrideDefault(getDefaultConf(), provided)
}

const getDefaultConf = (): NotePickerConf => ({
  duration: 1,
  velocity: 100,
  veloPref: 'randomPerEach',
  durationStrategy: 'fixed',
  pitchStrategy: 'fixed',
})

// Note

export function pickNote(conf: NotePickerConf, scale: Scale): Note | undefined {
  const pitch = getNotePitch(conf, scale)
  if (!pitch) return
  return {
    pitch: pitch,
    dur: getNoteDuration(conf),
    vel: getNoteVelocity(conf),
  }
}

export function pickHarmonizedNotes(conf: NotePickerConf, scale: Scale): Note[] | undefined {
  const n = pickNote(conf, scale)
  if (!n) return
  return [n, ...harmonizeNote(n, conf, scale)]
}

export function harmonizeNote(note: Note, conf: PitchConf, scale: Scale): Note[] {
  if (!conf.harmonizer) return []
  return harmonize(note, scale.wholePitches, conf.harmonizer)
}

// Pitch

export function adjustNotePitch(
  n: Note,
  scale: Scale,
  conf: PitchConf,
  d?: 'up' | 'down' | 'bi'
): void {
  if (isIncludedInScale(n.pitch, scale)) return
  if (conf.pitchStrategy === 'fixed') {
    n.pitch = scale.pickNearestPitch(n.pitch as number, d)
  }
}

export function changeNotePitch(n: Note, scale: Scale): void {
  if (n.pitch === 'random') return
  n.pitch = getDifferentPitch(scale, n.pitch) || n.pitch
}

function isIncludedInScale(pitch: Note['pitch'], scale: Scale): boolean {
  if (pitch === 'random') return true
  return scale.primaryPitches.includes(pitch)
}

function getNotePitch(conf: PitchConf, scale: Scale): Note['pitch'] | undefined {
  if (conf.pitchStrategy === 'randomPerLoop') return 'random'
  else return scale.pickRandomPitch()
}

function getDifferentPitch(scale: Scale, originalPitch: number, r = 0): number {
  if (r > 20) return originalPitch
  const newPitch = scale.pickRandomPitch()
  if (originalPitch !== newPitch && newPitch !== undefined) return newPitch
  return getDifferentPitch(scale, originalPitch, r + 1)
}

// Duration

function getNoteDuration({ duration: noteDur, durationStrategy }: DurationConf): Note['dur'] {
  return durationStrategy === 'randomInRange' ? noteDur : pickRange(noteDur)
}

// Velocity

function getNoteVelocity({ veloPref, velocity: noteVel }: VelocityConf): Note['vel'] {
  return veloPref === 'randomPerEach' ? noteVel : pickRange(noteVel)
}

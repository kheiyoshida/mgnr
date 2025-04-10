import { Note, Scale } from 'mgnr-core'
import { pickRange } from 'utils'

/**
 * duration must be in sixteenth unit
 */
export type ConcreteNote = {
  [key in keyof Note]: number
}

export function convertToConcreteNote(scale: Scale, note: Note): ConcreteNote {
  const concretePitch = note.pitch === 'random' ? scale.pickRandomPitch() : note.pitch
  if (!concretePitch) throw Error(`pitch could not be defined`)
  return {
    pitch: concretePitch,
    dur: pickRange(note.dur),
    vel: pickRange(note.vel),
  }
}

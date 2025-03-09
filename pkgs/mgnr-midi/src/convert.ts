import { Note } from 'mgnr-core'
import { ConcreteNote, MidiChannelNumber, MidiNote } from './types'
import { Scale } from 'mgnr-core/src'
import { pickRange } from 'utils'

export function convertToConcreteNote(scale: Scale, note: Note): ConcreteNote {
  const concretePitch = note.pitch === 'random' ? scale.pickRandomPitch() : note.pitch
  if (!concretePitch) throw Error(`pitch could not be defined`)
  return {
    pitch: concretePitch,
    dur: pickRange(note.dur),
    vel: pickRange(note.vel),
  }
}

export function convertToMidiNote(chNumber: MidiChannelNumber, note: ConcreteNote): MidiNote {
  return {
    velocity: note.vel,
    note: note.pitch,
    channel: (chNumber - 1) as MidiNote['channel'],
  }
}

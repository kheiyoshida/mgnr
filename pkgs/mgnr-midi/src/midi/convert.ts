import { MidiChannelNumber, MidiNote } from './types'
import { ConcreteNote } from '../outlet'

export function convertToMidiNote(chNumber: MidiChannelNumber, note: ConcreteNote): MidiNote {
  return {
    velocity: note.vel,
    note: note.pitch,
    channel: (chNumber - 1) as MidiNote['channel'],
  }
}

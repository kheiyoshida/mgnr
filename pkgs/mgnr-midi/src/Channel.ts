import { MidiPort } from './Port'
import { convertToMidiNote } from './convert'
import { ConcreteNote, MidiChannelNumber } from './types'

export class MidiChannel {
  constructor(
    readonly port: MidiPort,
    readonly chNumber: MidiChannelNumber
  ) {}

  sendNote(note: ConcreteNote, startInMeasure: number, endInMeasure: number) {
    const midiNote = convertToMidiNote(this.chNumber, note)
    this.port.noteOnAtRelativeBeat(startInMeasure, midiNote)
    this.port.noteOffAtRelativeBeat(endInMeasure, { ...midiNote, velocity: 0 })
  }
}

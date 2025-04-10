import { MidiPort } from './Port'
import { convertToMidiNote } from './convert'
import { MidiChannelNumber } from './types'
import { ConcreteNote, MidiCh } from '../outlet'

export class MidiChannel implements MidiCh {
  constructor(
    readonly port: MidiPort,
    readonly chNumber: MidiChannelNumber
  ) {}

  sendNoteOn(note: ConcreteNote): void {
    this.port.sendNoteOn(convertToMidiNote(this.chNumber, note))
  }

  sendNoteOff(note: ConcreteNote): void {
    this.port.sendNoteOff(convertToMidiNote(this.chNumber, note))
  }
}

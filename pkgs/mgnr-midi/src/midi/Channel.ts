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

type MidiChGroupPart = [chNumber: MidiChannelNumber, minPitch: number, maxPitdh: number]

/**
 * layered channels bus that send notes to different midi channels depending on pitch.
 * when pitch is within the given part's range (inclusive), it sends note to configured channel
 */
export class LayeredMidiChannelGroup implements MidiCh {
  constructor(readonly port: MidiPort, readonly group: MidiChGroupPart[]) {}

  sendNoteOn(note: ConcreteNote): void {
    const channels = this.#selectChannels(note.pitch)
    channels.forEach((chNum: MidiChannelNumber) => {
      this.port.sendNoteOn(convertToMidiNote(chNum, note))
    })
  }

  sendNoteOff(note: ConcreteNote): void {
    const channels = this.#selectChannels(note.pitch)
    channels.forEach((chNum: MidiChannelNumber) => {
      this.port.sendNoteOff(convertToMidiNote(chNum, note))
    })
  }

  #selectChannels(pitch: number): MidiChannelNumber[] {
    return this.group.filter(part => part[1] <= pitch && pitch <= part[2]).map(part => part[0])
  }
}

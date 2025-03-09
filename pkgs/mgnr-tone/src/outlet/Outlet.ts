import { Outlet, SequenceGenerator, convertMidiToNoteName } from 'mgnr-core'
import { LayeredNoteBuffer, NoteBuffer } from './Buffer'
import { ToneOutletPort } from './OutletPort'
import { LayeredInstrument } from '../instrument'
import * as Transport from '../tone-wrapper/Transport'
import { ToneInst } from '../types'

export class ToneOutlet extends Outlet<ToneInst> {
  sendNote(pitch: number, duration: number, time: number, velocity: number): void {
    this.triggerNote(pitch, duration, time, velocity)
  }
  protected triggerNote(pitch: number, duration: number, time: number, velocity: number): void {
    const noteName = convertMidiToNoteName(pitch)
    this.inst.triggerAttackRelease(noteName, duration, time, velocity / 127)
  }
  assignGenerator(generator: SequenceGenerator) {
    return new ToneOutletPort(this, generator)
  }
}

export class MonoOutlet extends ToneOutlet {
  #buffer: NoteBuffer
  constructor(inst: ToneInst, bufferTimeFrame: number = Transport.toSeconds('16n')) {
    super(inst)
    this.#buffer = new NoteBuffer(bufferTimeFrame)
    Transport.scheduleRepeat((time) => {
      const notes = this.#buffer!.consume(time)
      if (!notes.length) return
      const note = notes[0]
      this.triggerNote(note.pitch, note.duration, note.time, note.velocity)
    }, bufferTimeFrame, 0)
  }
  sendNote(pitch: number, duration: number, time: number, velocity: number): void {
    this.#buffer.insert({ pitch, duration, time, velocity })
  }
}

export class LayeredOutlet extends ToneOutlet {
  #buffer: LayeredNoteBuffer
  constructor(inst: LayeredInstrument, bufferTimeFrame: number = Transport.toSeconds('16n')) {
    super(inst)
    this.#buffer = new LayeredNoteBuffer(bufferTimeFrame, inst.instruments)
    Transport.scheduleRepeat((time) => {
      const noteGroups = this.#buffer!.consume(time)
      noteGroups.forEach((notes) => {
        if (!notes.length) return
        const note = notes[0]
        this.triggerNote(note.pitch, note.duration, note.time, note.velocity)
      })
    }, bufferTimeFrame, 0)
  }
  sendNote(pitch: number, duration: number, time: number, velocity: number): void {
    this.#buffer.insert({ pitch, duration, time, velocity })
  }
}

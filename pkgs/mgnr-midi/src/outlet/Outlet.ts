import { Outlet, SequenceGenerator } from 'mgnr-core'
import { MidiChOutletPort } from './OutletPort'
import { Scheduler, Time } from '../schedule'
import { ConcreteNote } from './Note'

export type MidiCh = {
  sendNoteOn(note: ConcreteNote): void
  sendNoteOff(note: ConcreteNote): void
}

export class MidiChOutlet extends Outlet<MidiCh> {
  private readonly scheduler = Scheduler.get()

  sendNote(note: ConcreteNote, time: Time): void {
    this.scheduler.scheduleEvent({
      callback: () => this.inst.sendNoteOn(note),
      time: time,
    })
    this.scheduler.scheduleEvent({
      callback: () => this.inst.sendNoteOff({ ...note, vel: 0 }),
      time: time.add(note.dur), // treat duration in 16th-note unit
    })
  }

  assignGenerator(generator: SequenceGenerator) {
    return new MidiChOutletPort(this, generator)
  }
}


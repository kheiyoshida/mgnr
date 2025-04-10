import { MidiCh, MidiChOutlet } from './Outlet'
import { ConcreteNote } from './Note'
import { Scheduler, Time } from '../schedule'

describe(`${MidiChOutlet.name}`, () => {
  beforeAll(() => jest.useFakeTimers())
  afterAll(jest.useRealTimers)

  it(`sends note on/off signal to midi channel at the right time`, () => {
    Scheduler.get().start()
    const ch: MidiCh = {
      sendNoteOn: jest.fn(),
      sendNoteOff: jest.fn(),
    }
    const outlet = new MidiChOutlet(ch)

    const note: ConcreteNote = {
      pitch: 60,
      vel: 100,
      dur: 1,
    }
    outlet.sendNote(note, new Time(2))

    jest.advanceTimersByTime(Time.unitInMillis) // 1
    expect(ch.sendNoteOn).not.toHaveBeenCalled()
    expect(ch.sendNoteOff).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis) // 2
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(1)
    expect(ch.sendNoteOff).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis) // 3
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(1)
    expect(ch.sendNoteOff).toHaveBeenCalledTimes(1)
  })
})

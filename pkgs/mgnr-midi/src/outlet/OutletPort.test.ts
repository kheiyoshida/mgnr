import * as core from 'mgnr-core'
import { SequenceNoteMap } from 'mgnr-core'
import { MidiCh, MidiChOutlet } from './Outlet'
import { MidiChOutletPort } from './OutletPort'
import { Scheduler, Time } from '../schedule'

describe(`${MidiChOutletPort.name}`, () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it(`can loop sequence to send each note to the midi channel`, () => {
    const ch: MidiCh = {
      sendNoteOff: jest.fn(),
      sendNoteOn: jest.fn(),
    }
    const outlet = new MidiChOutlet(ch)
    const generator = core.SequenceGenerator.create({
      sequence: {
        fillStrategy: 'fixed',
        division: 8,
        length: 8,
      },
    })
    const outletPort = outlet.assignGenerator(generator)

    const noteMap: SequenceNoteMap = {
      1: [
        {
          pitch: 60,
          vel: 100,
          dur: 1,
        },
      ],
      3: [
        {
          pitch: 67,
          vel: 100,
          dur: 2,
        },
      ],
    }
    generator.constructNotes(noteMap)

    Scheduler.get().start()
    outletPort.loopSequence(4)

    // actual events happen a bit later than the scheduling
    jest.advanceTimersByTime(Time.unitInMillis * MidiChOutletPort.scheduleOverhead)

    jest.advanceTimersByTime(0) // 0
    expect(ch.sendNoteOn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis) // 0.5 in 8th division
    expect(ch.sendNoteOn).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis) // 1 in 8th division
    expect(ch.sendNoteOn).toHaveBeenCalled()
    expect(ch.sendNoteOff).not.toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis * 2) // 2
    expect(ch.sendNoteOff).toHaveBeenCalled()

    jest.advanceTimersByTime(Time.unitInMillis * 2) // 3
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(2)
    expect(ch.sendNoteOn).toHaveBeenLastCalledWith({ dur: 4, pitch: 67, vel: 100 })

    jest.advanceTimersByTime(Time.unitInMillis * 2 * 2) // 5
    expect(ch.sendNoteOff).toHaveBeenCalledTimes(2)
    expect(ch.sendNoteOff).toHaveBeenLastCalledWith({ dur: 4, pitch: 67, vel: 0 })

    // 2nd loop
    jest.advanceTimersByTime(Time.unitInMillis * 2 * 3) // 8
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(2)
    expect(ch.sendNoteOff).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(Time.unitInMillis * 2) // 9
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(3)

    jest.advanceTimersByTime(Time.unitInMillis * 2) // 10
    expect(ch.sendNoteOff).toHaveBeenCalledTimes(3)
  })

  it(`can loop sequence & fire events on each loop`, () => {
    const ch: MidiCh = {
      sendNoteOff: jest.fn(),
      sendNoteOn: jest.fn(),
    }
    const outlet = new MidiChOutlet(ch)
    const generator = core.SequenceGenerator.create({
      sequence: {
        fillStrategy: 'fixed',
        division: 16,
        length: 16,
      },
    })
    const outletPort = outlet.assignGenerator(generator)
    const noteMap: SequenceNoteMap = {
      0: [
        {
          pitch: 60,
          vel: 100,
          dur: 1,
        },
      ],
    }
    generator.constructNotes(noteMap)

    const elapsedHandler = jest.fn()
    const endedHandler = jest.fn()

    Scheduler.get().start()
    outletPort.loopSequence(2).onElapsed(elapsedHandler).onEnded(endedHandler)

    // actual events happen a bit later than the scheduling
    jest.advanceTimersByTime(Time.unitInMillis * MidiChOutletPort.scheduleOverhead)

    // 1st loop
    jest.advanceTimersByTime(0)
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(1)
    expect(elapsedHandler).toHaveBeenCalledTimes(0)

    /// 2nd loop
    jest.advanceTimersByTime(Time.unitInMillis * 16)
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(2)
    expect(elapsedHandler).toHaveBeenCalledTimes(1)

    // loop set ended & next set started
    jest.advanceTimersByTime(Time.unitInMillis * 16)
    expect(ch.sendNoteOn).toHaveBeenCalledTimes(3)
    expect(endedHandler).toHaveBeenCalledTimes(1)
  })
})

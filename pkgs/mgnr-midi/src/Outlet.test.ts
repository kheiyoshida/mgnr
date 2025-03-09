import { SequenceNoteMap } from 'mgnr-core'
import * as core from 'mgnr-core/src'
import { MidiChannel } from './Channel'
import { MidiChOutlet } from './Outlet'
import { MidiPort } from './Port'
import { mockOutputPorts } from './__tests__/mock'

jest.mock('easymidi')
beforeAll(mockOutputPorts)

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

describe(`${MidiChOutlet.name}`, () => {
  it(`can loop sequence to send each note to the midi channel`, () => {
    const port = new MidiPort('midi port 1', 120)
    const ch = new MidiChannel(port, 1)
    const outlet = new MidiChOutlet(ch)
    const generator = core.createGenerator({
      sequence: {
        fillStrategy: 'fixed',
        division: 8,
      }
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
      3: [
        {
          pitch: 67,
          vel: 100,
          dur: 2,
        },
      ],
    }
    generator.constructNotes(noteMap)
    const spySendNote = jest.spyOn(ch, 'sendNote').mockImplementation()
    outletPort.loopSequence()
    jest.advanceTimersByTime(0)
    expect(spySendNote).toHaveBeenCalledTimes(2)
    expect(spySendNote).toHaveBeenCalledWith(noteMap[0][0], 0, 1 / 8)
    expect(spySendNote).toHaveBeenCalledWith(noteMap[3][0], 3 / 8, 5 / 8)
  })
  it(`can loop sequence & fire events on each loop`, () => {
    const port = new MidiPort('midi port 1', 120)
    const ch = new MidiChannel(port, 1)
    const outlet = new MidiChOutlet(ch)
    const generator = core.createGenerator({
      sequence: {
        fillStrategy: 'fixed',
        division: 8,
        length: 8,
      }
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
    const spySendNote = jest.spyOn(ch, 'sendNote').mockImplementation()
    const elapsedHandler = jest.fn()
    const endedHandler = jest.fn()
    outletPort.loopSequence(2).onElapsed(elapsedHandler).onEnded(endedHandler)
    // 1st loop
    jest.advanceTimersByTime(0)
    expect(spySendNote).toHaveBeenCalledTimes(1)
    expect(elapsedHandler).toHaveBeenCalledTimes(1)
    /// 2nd loop
    jest.advanceTimersByTime(2000)
    expect(spySendNote).toHaveBeenCalledTimes(2)
    expect(elapsedHandler).toHaveBeenCalledTimes(2)
    // loop ended
    jest.advanceTimersByTime(2000)
    expect(spySendNote).toHaveBeenCalledTimes(2)
    expect(elapsedHandler).toHaveBeenCalledTimes(2) // is this ok? 
    expect(endedHandler).toHaveBeenCalledTimes(1)
  })
})

import easymidi from 'easymidi'
import { MidiPort } from './Port'
import { mockOutputPorts } from './__tests__/mock'
import { MidiNote } from './types'

jest.mock('easymidi')
beforeAll(mockOutputPorts)

describe(`${MidiPort.name}`, () => {
  it(`can be created with MIDI port name`, () => {
    const portName = 'midi port 1'
    const port = new MidiPort(portName, 120)
    expect(port.portName).toBe(portName)
    expect(easymidi.Output).toHaveBeenCalledWith(portName)
    expect(port.msPerMeasure).toBe(2000)
  })
  it(`should throw when port name was not found`, () => {
    const portName = 'fugafugafoo'
    expect(() => {
      new MidiPort(portName, 120)
    }).toThrowErrorMatchingInlineSnapshot(
      `"Output port fugafugafoo is not available. Available ports are: midi port 1, midi port 2"`
    )
  })
  it(`can send note on/off message at a relative beat`, () => {
    jest.useFakeTimers()
    const port = new MidiPort('midi port 1', 120)
    const spySend = jest.spyOn(easymidi.Output.prototype, 'send').mockImplementation()
    const onNote: MidiNote = {
      note: 60,
      velocity: 100,
      channel: 1,
    }
    const offNote = { ...onNote, velocity: 0 }
    port.noteOnAtRelativeBeat(0 / 8, onNote)
    port.noteOffAtRelativeBeat(2 / 8, offNote)
    port.noteOnAtRelativeBeat(3 / 8, onNote)
    port.noteOffAtRelativeBeat(5 / 8, offNote)

    jest.advanceTimersByTime(0) // 0/8
    expect(spySend).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(250) // 1/8
    expect(spySend).toHaveBeenCalledTimes(1)
    expect(spySend).toHaveBeenLastCalledWith('noteon', onNote)

    jest.advanceTimersByTime(250) // 2/8
    expect(spySend).toHaveBeenCalledTimes(2)
    expect(spySend).toHaveBeenLastCalledWith('noteoff', offNote)

    jest.advanceTimersByTime(250) // 3/8
    expect(spySend).toHaveBeenCalledTimes(3)
    expect(spySend).toHaveBeenLastCalledWith('noteon', onNote)

    jest.advanceTimersByTime(500) // 5/8
    expect(spySend).toHaveBeenCalledTimes(4)
    expect(spySend).toHaveBeenLastCalledWith('noteoff', offNote)

    jest.useRealTimers()
  })

  it(`can get 16 midi channel outlets`, () => {
    const port = new MidiPort('midi port 1', 120)
    const outlets = port.getChannelOutlets()
    outlets.forEach((ch, i) => {
      expect(ch.midiCh.chNumber).toBe(i + 1)
    })
  })
})

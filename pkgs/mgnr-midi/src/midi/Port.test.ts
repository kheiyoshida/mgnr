import easymidi from 'easymidi'
import { MidiPort } from './Port'
import { mockOutputPorts } from '../__tests__/mock'
import { MidiNote } from './types'

jest.mock('easymidi')
beforeAll(mockOutputPorts)

describe(`${MidiPort.name}`, () => {
  it(`can be created with MIDI port name`, () => {
    const portName = 'midi port 1'
    const port = new MidiPort(portName)
    expect(port.portName).toBe(portName)
    expect(easymidi.Output).toHaveBeenCalledWith(portName)
  })
  it(`should throw when port name was not found`, () => {
    const portName = 'fugafugafoo'
    expect(() => {
      new MidiPort(portName)
    }).toThrowErrorMatchingInlineSnapshot(
      `"Output port fugafugafoo is not available. Available ports are: midi port 1, midi port 2"`
    )
  })
  it(`can send note on/off messages`, () => {
    const port = new MidiPort('midi port 1')
    const spySend = jest.spyOn(easymidi.Output.prototype, 'send').mockImplementation()
    const onNote: MidiNote = {
      note: 60,
      velocity: 100,
      channel: 1,
    }
    const offNote = { ...onNote, velocity: 0 }

    port.sendNoteOn(onNote)
    expect(spySend).toHaveBeenCalledTimes(1)
    expect(spySend).toHaveBeenLastCalledWith('noteon', onNote)

    port.sendNoteOff(offNote)
    expect(spySend).toHaveBeenCalledTimes(2)
    expect(spySend).toHaveBeenLastCalledWith('noteoff', offNote)
  })
})

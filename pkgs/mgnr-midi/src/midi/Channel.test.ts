import { MidiChannel } from './Channel'
import { MidiPort } from './Port'
import { mockOutputPorts } from '../__tests__/mock'
import { ConcreteNote } from '../outlet'

jest.mock('easymidi')
beforeAll(mockOutputPorts)

describe(`${MidiChannel.name}`, () => {
  it(`can be created with midi port & channel number`, () => {
    const port = new MidiPort('midi port 1')
    const chNumber = 1
    const ch = new MidiChannel(port, chNumber)
    expect(ch.chNumber).toBe(chNumber)
  })
  it(`can send note to the midi channel output`, () => {
    const port = new MidiPort('midi port 1')
    const ch = new MidiChannel(port, 1)
    const note: ConcreteNote = {
      pitch: 60,
      vel: 100,
      dur: 1,
    }
    const spyNoteOn = jest.spyOn(port, 'sendNoteOn')
    const spyNoteOff = jest.spyOn(port, 'sendNoteOff')
    ch.sendNoteOn(note)
    ch.sendNoteOff({ ...note, vel: 0 })

    expect(spyNoteOn).toHaveBeenCalledWith({
      velocity: 100,
      note: 60,
      channel: ch.chNumber - 1,
    })
    expect(spyNoteOff).toHaveBeenCalledWith({
      velocity: 0,
      note: 60,
      channel: ch.chNumber - 1,
    })
  })
})

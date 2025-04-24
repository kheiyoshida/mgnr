import { LayeredMidiChannelGroup, MidiChannel } from './Channel'
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

describe(`${LayeredMidiChannelGroup.name}`, () => {
  it(`can send note to different midi channels depending on its pitch`, () => {
    const port = new MidiPort('midi port 1')
    const midiChGroup = new LayeredMidiChannelGroup(
      port,
      [
        [1, 20, 60],
        [2, 61, 120]
      ]
    )
    const spyNoteOn = jest.spyOn(port, 'sendNoteOn')
    const spyNoteOff = jest.spyOn(port, 'sendNoteOff')

    midiChGroup.sendNoteOn({ dur: 1, pitch: 34, vel: 100 })
    expect(spyNoteOn).toHaveBeenCalledWith({
      velocity: 100,
      note: 34,
      channel: 0,
    })

    midiChGroup.sendNoteOff({ dur: 1, pitch: 34, vel: 0 })
    expect(spyNoteOff).toHaveBeenCalledWith({
      velocity: 0,
      note: 34,
      channel: 0,
    })

    midiChGroup.sendNoteOn({ dur: 1, pitch: 80, vel: 100 })
    expect(spyNoteOn).toHaveBeenCalledWith({
      velocity: 100,
      note: 80,
      channel: 1, // select final channel by pitch
    })

    midiChGroup.sendNoteOff({ dur: 1, pitch: 80, vel: 0 })
    expect(spyNoteOff).toHaveBeenCalledWith({
      velocity: 0,
      note: 80,
      channel: 1,
    })
  })

  it(`can send notes to multiple channels if layers overlapping`, () => {
    const port = new MidiPort('midi port 1')
    const midiChGroup = new LayeredMidiChannelGroup(
      port,
      [
        [1, 20, 80],
        [2, 60, 120]
      ]
    )
    const spyNoteOn = jest.spyOn(port, 'sendNoteOn')
    const spyNoteOff = jest.spyOn(port, 'sendNoteOff')

    midiChGroup.sendNoteOn({ dur: 1, pitch: 70, vel: 100 })
    expect(spyNoteOn).toHaveBeenCalledWith({
      velocity: 100,
      note: 70,
      channel: 0,
    })
    expect(spyNoteOn).toHaveBeenCalledWith({
      velocity: 100,
      note: 70,
      channel: 1, // channel 2 too
    })

    midiChGroup.sendNoteOff({ dur: 1, pitch: 70, vel: 0 })
    expect(spyNoteOff).toHaveBeenCalledWith({
      velocity: 0,
      note: 70,
      channel: 0,
    })
    expect(spyNoteOff).toHaveBeenCalledWith({
      velocity: 0,
      note: 70,
      channel: 1, // channel 2 too
    })
  })
})

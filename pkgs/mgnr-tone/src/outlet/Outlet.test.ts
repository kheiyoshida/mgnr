import * as Tone from 'tone'
import { LayeredOutlet, MonoOutlet, ToneOutlet } from './Outlet'
import { LayeredInstrument } from '../instrument'

beforeEach(() => jest.useFakeTimers())
afterEach(() => jest.useRealTimers())

jest.mock('tone', () => ({
  ...jest.doMock('tone'),
  Synth: jest.fn().mockImplementation(() => ({ triggerAttackRelease: jest.fn() })),
  NoiseSynth: class {}
}))

jest.mock('../tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../tone-wrapper/Transport')>(
    '../tone-wrapper/Transport'
  ),
  scheduleRepeat: (cb: (time: number) => void, bufferTimeFrame: number) => {
    let t = 0
    setInterval(() => {
      t += bufferTimeFrame
      cb(t)
    }, bufferTimeFrame)
  },
}))

describe(`${ToneOutlet.name}`, () => {
  it(`triggers the instrument at the correct time`, () => {
    const inst = new Tone.Synth()
    const outlet = new ToneOutlet(inst)
    const spyInstTrigger = jest.spyOn(inst, 'triggerAttackRelease').mockImplementation(jest.fn())
    outlet.sendNote(60, 1, 250, 100)
    expect(spyInstTrigger).toHaveBeenCalledTimes(1)
    expect(spyInstTrigger).toHaveBeenCalledWith('C4', 1, 250, expect.any(Number))
  })
})

describe(`${MonoOutlet.name}`, () => {
  it(`consumes items at each time frame`, () => {
    const inst = new Tone.Synth()
    const outlet = new MonoOutlet(inst, 250)
    const spyInstTrigger = jest.spyOn(inst, 'triggerAttackRelease').mockImplementation(jest.fn())
    outlet.sendNote(60, 1, 250, 100)
    outlet.sendNote(62, 1, 250, 100) // gets dropped
    jest.advanceTimersByTime(250)
    expect(spyInstTrigger).toHaveBeenCalledTimes(1)
    expect(spyInstTrigger).toHaveBeenCalledWith('C4', 1, 250, expect.any(Number))
  })
})

describe(`${LayeredOutlet.name}`, () => {
  it(`consumes items for each layer at each time frame`, () => {
    const inst = new Tone.Synth()
    const inst2 = new Tone.Synth()
    const composite = new LayeredInstrument([
      { min: 20, max: 71, inst: inst },
      { min: 72, max: 100, inst: inst2 },
    ])
    const outlet = new LayeredOutlet(composite, 250)
    const spyInstTrigger = jest.spyOn(inst, 'triggerAttackRelease').mockImplementation(jest.fn())
    const spyInst2Trigger = jest.spyOn(inst2, 'triggerAttackRelease').mockImplementation(jest.fn())
    outlet.sendNote(60, 1, 250, 100)
    outlet.sendNote(62, 1, 250, 100) // gets dropped
    outlet.sendNote(72, 1, 250, 100) // doesn't get dropped
    outlet.sendNote(74, 1, 250, 100) // gets dropped
    jest.advanceTimersByTime(250)
    expect(spyInstTrigger).toHaveBeenCalledTimes(1)
    expect(spyInstTrigger).toHaveBeenCalledWith('C4', 1, 250, expect.any(Number))
    expect(spyInst2Trigger).toHaveBeenCalledTimes(1)
    expect(spyInst2Trigger).toHaveBeenCalledWith('C5', 1, 250, expect.any(Number))
  })
})
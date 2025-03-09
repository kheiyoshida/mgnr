import { CompositeInstrument, LayeredInstrument } from './CompositeInstrument'
import * as Tone from 'tone'

jest.mock('tone', () => ({
  ...jest.doMock('tone'),
  Synth: jest.fn(() => ({
    triggerAttackRelease: jest.fn(),
    connect: jest.fn(),
  })),
  Delay: jest.fn(() => ({
    connect: jest.fn(),
  })),
  NoiseSynth: class {
    triggerAttackRelease = jest.fn()
    connect = jest.fn()
  },
}))

describe(`${CompositeInstrument.name}`, () => {
  it(`can be constructed with multiple instruments to compose of`, () => {
    const syn1 = new Tone.Synth()
    const syn2 = new Tone.Synth()
    expect(() => {
      new CompositeInstrument(syn1, syn2)
    }).not.toThrow()
  })
  it(`should invoke triggerAttackRelease of each instrument part`, () => {
    const syn1 = new Tone.Synth()
    const syn2 = new Tone.Synth()
    const composite = new CompositeInstrument(syn1, syn2)
    composite.triggerAttackRelease('C4', '8n', undefined, undefined)
    expect(syn1.triggerAttackRelease).toHaveBeenCalledWith('C4', '8n', undefined, undefined)
    expect(syn2.triggerAttackRelease).toHaveBeenCalledWith('C4', '8n', undefined, undefined)
  })
  it(`should connect every node to the given node`, () => {
    const syn1 = new Tone.Synth()
    const syn2 = new Tone.Synth()
    const composite = new CompositeInstrument(syn1, syn2)
    const effect = new Tone.Delay()
    composite.connect(effect)
    expect(syn1.connect).toHaveBeenCalledWith(effect)
    expect(syn2.connect).toHaveBeenCalledWith(effect)
  })
})

describe(`${LayeredInstrument.name}`, () => {
  it(`should invoke triggerAttackRelease of the inst that covers the note pitch`, () => {
    const syn1 = new Tone.Synth()
    const syn2 = new Tone.Synth()
    const composite = new LayeredInstrument([
      { inst: syn1, min: 20, max: 60 },
      { inst: syn2, min: 60, max: 120 },
    ])
    composite.triggerAttackRelease('C5', '8n', undefined, undefined)
    expect(syn1.triggerAttackRelease).not.toHaveBeenCalled()
    expect(syn2.triggerAttackRelease).toHaveBeenCalledWith('C5', '8n', undefined, undefined)
  })
  it(`should connect every node to the given node`, () => {
    const syn1 = new Tone.Synth()
    const syn2 = new Tone.Synth()
    const composite = new LayeredInstrument([
      { inst: syn1, min: 20, max: 60 },
      { inst: syn2, min: 60, max: 120 },
    ])
    const effect = new Tone.Delay()
    composite.connect(effect)
    expect(syn1.connect).toHaveBeenCalledWith(effect)
    expect(syn2.connect).toHaveBeenCalledWith(effect)
  })
})

import * as mgnr from '@mgnr/tone'
import * as Tone from 'tone'

export const monoSynth = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'sine',
  },
  envelope: {
    attack: 0,
    decay: 0.8,
    sustain: 0.3,
    release: 0.1,
  },
  volume: -10,
  detune: -20,
  filter: {
    type: 'lowpass',
    frequency: 5000,
  },
})

export const monoSynth2 = new Tone.PolySynth(Tone.MonoSynth, {
  oscillator: {
    type: 'triangle10',
  },
  envelope: {
    attack: 0,
    decay: 0.3,
    sustain: 0.3,
    release: 0.1,
  },
  volume: -10,
  detune: 20,
  filter: {
    type: 'lowpass',
    frequency: 2000,
  },
})

export const kick = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.8,
    sustain: 0.2,
    release: 0.5,
  },
  volume: -20,
  detune: -200,
})

export const hh = new Tone.NoiseSynth({
  envelope: {
    attack: 0,
    decay: 0.1,
    sustain: 1/100,
    release: 0,
  },
  volume: -22,
})

export const snare = new mgnr.CompositeInstrument(
  new Tone.MembraneSynth({
    oscillator: {
      type: 'square32',
    },
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.3,
      release: 0.2,
    },
    volume: -34,
    detune: -500,
  }),
  new Tone.NoiseSynth({
    envelope: {
      attack: 0,
      decay: 0.05,
      sustain: 0.01,
      release: 0,
    },
    volume: -20,
  })
)

export const drumMachine = new mgnr.LayeredInstrument([
  { min: 20, max: 40, inst: kick },
  { min: 40, max: 60, inst: snare },
  { min: 60, max: 100, inst: hh },
])

export const compositeSynth = new mgnr.CompositeInstrument(monoSynth, monoSynth2)

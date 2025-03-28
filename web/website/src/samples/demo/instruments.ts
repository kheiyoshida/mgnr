import * as mgnr from '@mgnr/tone'
import * as Tone from 'tone'

export const pad = () => {
  const monoSynth = new Tone.PolySynth(Tone.MonoSynth, {
    oscillator: {
      type: 'triangle4',
    },
    envelope: {
      attack: 0,
      decay: 0.3,
      sustain: 0.1,
      release: 0.03,
    },
    volume: -10,
    detune: -20,
    filter: {
      type: 'lowpass',
      frequency: 8000,
    },
  })

  const monoSynth2 = new Tone.PolySynth(Tone.MonoSynth, {
    oscillator: {
      type: 'triangle10',
    },
    envelope: {
      attack: 0,
      decay: 0.3,
      sustain: 0.1,
      release: 0.1,
    },
    volume: -10,
    detune: 10,
    filter: {
      type: 'lowpass',
      frequency: 4000,
    },
  })

  return new mgnr.CompositeInstrument(monoSynth, monoSynth2)
}

export const drumMachine = () => {
  const kick = new Tone.MembraneSynth({
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.2,
      release: 0.5,
    },
    volume: -20,
    detune: -200,
  })

  const hh = new Tone.NoiseSynth({
    envelope: {
      attack: 0,
      decay: 0.02,
      sustain: 1 / 200,
      release: 0.5,
    },
    volume: -30,
  })

  const snare = new mgnr.CompositeInstrument(
    new Tone.MembraneSynth({
      oscillator: {
        type: 'sawtooth',
      },
      envelope: {
        attack: 0,
        decay: 0.1,
        sustain: 0.1,
        release: 0,
      },
      volume: -22,
      detune: -1000,
    }),
    new Tone.NoiseSynth({
      noise: {
        type: 'brown',
      },
      envelope: {
        attack: 0,
        decay: 0.05,
        sustain: 0.01,
        release: 0.1,
      },
      volume: -32,
    })
  )

  return new mgnr.LayeredInstrument([
    { min: 20, max: 40, inst: kick },
    { min: 40, max: 80, inst: snare },
    { min: 80, max: 100, inst: hh },
  ])
}

export const synth = () =>
  new mgnr.CompositeInstrument(
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle24',
      },
      envelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.5,
        release: 0.0,
      },
      volume: -24,
      filter: {
        type: 'lowpass',
        frequency: 1400,
      },
    }),
    new Tone.MonoSynth({
      oscillator: {
        type: 'triangle12',
      },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.2,
        release: 0.0,
      },
      volume: -10,
      detune: -60,
      filter: {
        type: 'lowpass',
        frequency: 800,
      },
    })
  )

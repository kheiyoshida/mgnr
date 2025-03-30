import * as mgnr from '@mgnr/tone'
import * as Tone from 'tone'
import { beat } from './patterns'
import { setupChannels } from './mix'

/**
 * demo song for mgnr playground.
 *
 * by clicking the button in the sandbox browser on the right, it starts playing audio.
 *
 * modify the code and explore random sequences it generates :+)
 */
export const main = () => {
  // mgnr provides a mixer and channels like one in DAW
  const channels = setupChannels()

  // base config for the scales from which generators should pick random notes
  const scaleSource = mgnr.createScaleSource({
    key: mgnr.pickRandomPitchName(),
    pref: 'omit25',
    range: { min: 50, max: 80 },
  })
  Tone.Transport.scheduleRepeat(() => {
    scaleSource.modulateAll({ key: mgnr.pickRandomPitchName() }, 4)
  }, '8m')

  // @mgnr/tone depends on Tone.js Transport.
  Tone.Transport.bpm.value = 132

  prepareDrums(channels.drumCh)
  preparePad(channels.padCh, scaleSource)
  prepareBass(channels.synthCh, scaleSource)
}

const preparePad = (channel: mgnr.InstChannel, scaleSource: mgnr.ScaleSource) => {
  const scale = scaleSource.createScale({ range: { min: 64, max: 102 } })

  // SequenceGenerator generates random sequences based on these configurations
  const generator = mgnr.SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 16,
      density: 0.8, // tries to fill 80% of 16 positions
      division: 4, // the unit for the notes and their positions (4=quarter notes)
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: { // the range in which note duration can be
        min: 2,
        max: 4,
      },
      harmonizer: { // random notes come with these harmonizing notes
        degree: ['2', '5'],
      },
    },
  })

  // You can supply another generator as a second sequence layer, which make more complex poly rhythm
  const generator2 = mgnr.SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 4,
      density: 0.4,
      division: 16,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 1,
        max: 4,
      },
    },
  })

  // generate the initial random sequences
  generator.constructNotes()
  generator2.constructNotes()

  // assign the generator to the channel (i.e. synth pad)
  const outlet = mgnr.createOutlet(channel.inst)
  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'inPlace' }) // changes the note's pitch in place
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'randomize' }) // changes the note's position and pitch
    })
  outlet
    .assignGenerator(generator2)
    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'inPlace' })
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'randomize' })
    })
}

const prepareBass = (channel: mgnr.InstChannel, scaleSource: mgnr.ScaleSource) => {
  const scale = scaleSource.createScale({ pref: 'major', range: { min: 24, max: 52 } })

  const generator1 = mgnr.SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 4,
      division: 1,
      density: 1,
    },
    note: {
      duration: 1,
    },
  })
  const generator2 = mgnr.SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 24,
      division: 16,
      density: 0.2,
    },
    note: {
      duration: {
        min: 1,
        max: 2,
      },
    },
  })
  generator1.constructNotes()
  generator2.constructNotes()

  const outlet = mgnr.createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  outlet
    .assignGenerator(generator1)
    .loopSequence(2)
    .onEnded((g) => g.resetNotes())
  outlet
    .assignGenerator(generator2)
    .loopSequence(1)
    .onEnded((g) => g.resetNotes())
}

const prepareDrums = (channel: mgnr.InstChannel) => {
  const scale = mgnr.createScale([30, 42, 90])
  const generator = mgnr.SequenceGenerator.create({
    scale: scale,
    note: {
      duration: 1,
    },
    sequence: {
      length: 16,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
    },
  })
  const generator2 = mgnr.SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 12,
      division: 16,
      density: 0.25,
      polyphony: 'mono',
    },
    note: {
      duration: 1,
    },
  })
  generator.constructNotes(beat)
  generator2.constructNotes()

  const outlet = mgnr.createOutlet(channel.inst, Tone.Transport.toSeconds('16n'))
  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((g, loopNth) => {
      if (loopNth % 2 === 1) {
        g.mutate({ strategy: 'inPlace', rate: 0.1 })
      }
      if (Math.random() > 0.95) {
        g.updateConfig({
          sequence: {
            density: g.sequence.density + (Math.random() - 0.5) * 0.1,
          },
        })
      }
    })
    .onEnded((g) => {
      if (Math.random() > 0.9) {
        g.resetNotes(beat)
      } else {
        g.eraseSequenceNotes()
      }
    })
  outlet
    .assignGenerator(generator2)
    .loopSequence(4)
    .onElapsed((g) => {
      g.mutate({ rate: 0.1, strategy: 'inPlace' })
    })
    .onEnded((g) => {
      g.updateConfig({
        sequence: {
          density: Math.max(0.0, Math.min(0.5, g.sequence.density + (Math.random() - 0.5))),
          length: g.sequence.length + Math.floor(Math.random() * 2),
        },
      })
    })
}

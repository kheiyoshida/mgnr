import * as mgnr from '@mgnr/tone'
import { SequenceGenerator, SequenceNoteMap } from '@mgnr/tone'
import * as Tone from 'tone'
import { compositeSynth, drumMachine } from './instruments'

const mixer = mgnr.getMixer()

export const main = () => {
  Tone.Transport.bpm.value = 172
  prepareDrums()
  prepareSynth()
}

const beat: SequenceNoteMap = {
  0: [
    {
      pitch: 30,
      vel: 100,
      dur: 1,
    }
  ],
  4: [
    {
      pitch: 30,
      vel: 100,
      dur: 1,
    }
  ],
  10: [
    {
      pitch: 30,
      vel: 100,
      dur: 1,
    }
  ],
  12: [
    {
      pitch: 30,
      vel: 100,
      dur: 1,
    }
  ]
}

const prepareDrums = () => {
  const scale = mgnr.createScale([30, 50, 90])
  const synCh = mixer.createInstChannel({
    inst: drumMachine,
    initialVolume: -6,
    effects: [new Tone.BitCrusher(16)],
  })

  const outlet = mgnr.createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))

  const generator = SequenceGenerator.create({
    scale: scale,
    note: {
      duration: 1,
    },
    sequence: {
      fillStrategy: 'fill',
      length: 16,
      division: 16,
      density: 0.25,
      polyphony: 'mono',
    },
  })
  const generator2 = SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 12,
      division: 16,
      density: 0.5,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: 1,
    },
  })

  generator.constructNotes(beat)
  generator2.constructNotes()

  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((g, n) => {
      if (n % 2 === 1) {
        g.sequence.iterateEachNote((note, i) => {
          g.sequence.deleteNoteFromPosition(i, note)
        })
      }
    })
    .onEnded((g) => {
      g.resetNotes(beat)
    })
  outlet
    .assignGenerator(generator2)
    .loopSequence(4)
    .onEnded((g) => g.mutate({ rate: 0.3, strategy: 'move' }))
}

const prepareSynth = () => {
  const scale = mgnr.createScale('C', 'omit25', { min: 50, max: 80 })
  const compositeCh = mixer.createInstChannel({
    inst: compositeSynth,
    initialVolume: -20,
    effects: [new Tone.PingPongDelay('.8n', 0.3)],
  })
  const outlet = mgnr.createOutlet(compositeCh.inst)
  const generator = mgnr.SequenceGenerator.create({
    scale: scale,
    sequence: {
      length: 10,
      density: 0.7,
      division: 4,
      polyphony: 'mono',
      fillStrategy: 'fill',
    },
    note: {
      duration: {
        min: 4,
        max: 8,
      },
      harmonizer: {
        degree: ['3', '5', '7'],
        force: false,
        lookDown: false,
      },
    },
  })
  generator.constructNotes()
  outlet
    .assignGenerator(generator)
    .loopSequence(4)
    .onElapsed((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'inPlace' })
    })
    .onEnded((generator) => {
      generator.mutate({ rate: 0.5, strategy: 'randomize' })
    })
}

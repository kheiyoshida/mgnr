import * as mgnr from '../src'
import { setupMidiPort } from './shared/setup'

const midiPort = setupMidiPort()

const midiCh1 = new mgnr.MidiChannel(midiPort, 1)
const midiCh2 = new mgnr.MidiChannel(midiPort, 2)

const outlet1 = new mgnr.MidiChOutlet(midiCh1)
const outlet2 = new mgnr.MidiChOutlet(midiCh2)

const scale = new mgnr.Scale({ key: 'C', pref: 'major', range: { min: 60, max: 92 } })
const generator1 = mgnr.SequenceGenerator.create({
  scale,
  sequence: {
    length: 8,
    division: 16,
    density: 0.6,
    polyphony: 'mono',
  },
})

generator1.constructNotes()

outlet1
  .assignGenerator(generator1)
  .loopSequence(2)
  .onElapsed((generator) => generator.mutate({ strategy: 'inPlace', rate: 0.3 }))
  .onEnded((generator) => generator.resetNotes())

const scale2 = new mgnr.Scale({ key: 'C', pref: 'major', range: { min: 30, max: 60 } })
const generator2 = mgnr.SequenceGenerator.create({
  scale: scale2,
  sequence: {
    length: 1,
    division: 2,
    density: 1.0,
    polyphony: 'mono',
  },
  note: {
    duration: {
      min: 1,
      max: 2,
    },
  },
})
generator2.constructNotes()
outlet2
  .assignGenerator(generator2)
  .loopSequence(2)
  .onEnded((generator) => generator.resetNotes())

mgnr.Scheduler.get().start()

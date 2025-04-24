import * as mgnr from '../src'
import { setupMidiPort } from './shared/setup'

const midiPort = setupMidiPort()

const midiCh1 = new mgnr.MidiChannel(midiPort, 1)
const midiCh2 = new mgnr.MidiChannel(midiPort, 2)

const outlet1 = new mgnr.MidiChOutlet(midiCh1)
const outlet2 = new mgnr.MidiChOutlet(midiCh2)

const scale = new mgnr.Scale({ key: 'C', pref: 'major' })
const generator1 = mgnr.SequenceGenerator.create({
  scale,
  sequence: {
    fillStrategy: 'fixed',
    length: 8,
    division: 8,
  },
})

generator1.constructNotes({
  0: [
    {
      pitch: 60,
      vel: 100,
      dur: 1,
    },
  ],
  2: [
    {
      pitch: 60,
      vel: 100,
      dur: 1,
    },
  ],
  4: [
    {
      pitch: 60,
      vel: 100,
      dur: 1,
    },
  ],
  6: [
    {
      pitch: 60,
      vel: 100,
      dur: 1,
    },
  ],
})

outlet1.assignGenerator(generator1).loopSequence(4)

const generator2 = mgnr.SequenceGenerator.create({
  scale,
  sequence: {
    fillStrategy: 'fixed',
    length: 4,
    division: 8,
  },
})
generator2.constructNotes({
  1: [
    {
      pitch: 64,
      vel: 100,
      dur: 1,
    },
  ],
  3: [
    {
      pitch: 64,
      vel: 100,
      dur: 1,
    },
  ],
})
outlet2.assignGenerator(generator2).loopSequence(4)

mgnr.Scheduler.get().start()

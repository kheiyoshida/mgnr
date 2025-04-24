import * as mgnr from '../src'
import { setupMidiPort } from './shared/setup'

const midiPort = setupMidiPort()

mgnr.Time.bpm = 172

const layeredChannels = new mgnr.LayeredMidiChannelGroup(midiPort, [
  [1, 20, 40],
  [2, 41, 60],
  [3, 61, 120],
])
const midiCh4 = new mgnr.MidiChannel(midiPort, 4)

const outlet1 = new mgnr.MidiChOutlet(layeredChannels)
const outlet2 = new mgnr.MidiChOutlet(midiCh4)

const scale = mgnr.createScale([30, 50, 62])

const generator = mgnr.SequenceGenerator.create({
  scale,
  note: {
    duration: 1,
  },
  sequence: {
    length: 16,
    density: 0.8,
    fillStrategy: 'fill',
  },
})

const notes = {
  0: [
    {
      pitch: 30,
      vel: 100,
      dur: 1,
    },
  ],
  4: [
    {
      pitch: 50,
      vel: 100,
      dur: 1,
    },
  ],
  10: [
    {
      pitch: 30,
      vel: 100,
      dur: 1,
    },
  ],
  12: [
    {
      pitch: 50,
      vel: 100,
      dur: 1,
    },
  ],
}

const generator2 = mgnr.SequenceGenerator.create({
  scale,
  sequence: {
    density: 0.25,
    length: 12,
  },
})

generator.constructNotes(notes)
generator2.constructNotes()

outlet1
  .assignGenerator(generator)
  .loopSequence(4)
  .onElapsed((g) => g.mutate({ rate: 0.2, strategy: 'move' }))
  .onEnded((g) => g.resetNotes(notes))

outlet2
  .assignGenerator(generator2)
  .loopSequence(4)
  .onElapsed((g) =>
    g.mutate({
      rate: 0.3,
      strategy: 'inPlace',
    })
  )
  .onEnded((g) => g.resetNotes())

const scheduler = mgnr.Scheduler.get()

scheduler.start()

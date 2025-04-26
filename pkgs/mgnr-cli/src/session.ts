import * as mgnr from './index'

const setup = () => {
  const scale = new mgnr.CliScale()
  const generator = new mgnr.CliSequenceGenerator({
    scale,
    sequence: {
      length: 16,
      density: 0.5,
    },
    note: {
      duration: 1,
    },
  })
  const generator2 = new mgnr.CliSequenceGenerator({})

  const midiPort = new mgnr.MidiPort('Logic Pro Virtual In')
  midiPort.configureExitHandlers()
  const channel = new mgnr.MidiChannel(midiPort, 1)
  const outlet = new mgnr.MidiChOutlet(channel)

  const port1 = outlet.assignGenerator(generator)
  const port2 = outlet.assignGenerator(generator2)

  mgnr.setupLogStream([generator, generator2], [scale])
  mgnr.Scheduler.get().start()

  return {
    p1: port1,
    p2: port2,
    s1: scale,
  }
}

mgnr.startReplSession(setup)

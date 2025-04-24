import * as mgnr from '../../src'

export const setupMidiPort = () => {
  const midiPortName = process.argv[2] ?? 'Logic Pro Virtual In'
  const midiPort = new mgnr.MidiPort(midiPortName)
  midiPort.configureExitHandlers()
  return midiPort
}

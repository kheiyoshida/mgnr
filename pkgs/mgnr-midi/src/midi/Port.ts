import easymidi from 'easymidi'
import { MidiNote } from './types'

export class PortNotFoundError extends Error {
  constructor(portName: string, availablePorts: string[]) {
    super(`Output port ${portName} is not available. Available ports are: ${availablePorts.join(`, `)}`)
  }
}

export class MidiPort {
  readonly portName: string
  readonly output: easymidi.Output

  constructor(portName: string) {
    const availablePorts = easymidi.getOutputs()
    if (!availablePorts.includes(portName)) {
      throw new PortNotFoundError(portName, availablePorts)
    }
    this.portName = portName
    this.output = new easymidi.Output(portName)
  }

  sendNoteOn(note: MidiNote) {
    this.output.send('noteon', note)
  }

  sendNoteOff(note: MidiNote) {
    this.output.send('noteoff', note)
  }
}

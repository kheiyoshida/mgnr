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

  /**
   * configure exit process to send note off signals to all notes/channels
   * to prevent hung midi signals.
   */
  configureExitHandlers() {
    process.on('exit', () => this.#allNotesOff())
    process.on('SIGINT', () => {
      this.#allNotesOff()
      process.exit()
    })
    process.on('uncaughtException', (err) => {
      // eslint-disable-next-line no-console
      console.error(err)
      this.#allNotesOff()
      process.exit(1)
    })
  }

  #allNotesOff() {
    for (let channel = 0; channel < 16; channel++) {
      for (let note = 0; note < 128; note++) {
        this.output.send('noteoff', {
          note,
          velocity: 0,
          channel: channel as easymidi.Channel,
        })
      }
    }
  }
}

import { SequenceConf, SequenceGenerator } from 'mgnr-midi'
import { Loggable } from '../stream/types'

export class CliSequenceGenerator extends SequenceGenerator implements Loggable {
  updateDensity(density: SequenceConf['density']) {
    this.updateConfig({ sequence: { density } })
  }

  updateDur(duration: number) {
    this.updateConfig({ note: { duration } })
  }

  updateVel(velocity: number) {
    this.updateConfig({ note: { velocity } })
  }

  randomise(rate: number) {
    this.mutate({ strategy: 'randomize', rate })
  }

  shuffle(rate: number) {
    this.mutate({ strategy: 'move', rate })
  }

  inPlace(rate: number) {
    this.mutate({ strategy: 'inPlace', rate })
  }

  useMono() {
    this.updateConfig({ sequence: { polyphony: 'mono' } })
  }

  usePoly() {
    this.updateConfig({ sequence: { polyphony: 'poly' } })
  }

  flush() {
    this.context.sequence.deleteEntireNotes()
  }

  get logState() {
    return {
      _: this.logName,
      length: this.sequence.length,
      notes: this.sequence.numOfNotes,
      density: this.sequence.density,
      duration: convertRange(this.picker.duration),
      velocity: convertRange(this.picker.velocity),
    }
  }

  logName: string = 'generator'
}

type Range = { min: number; max: number }

function convertRange(r: Range | number) {
  if (typeof r === 'number') return r
  else return `${r.min}-${r.max}`
}

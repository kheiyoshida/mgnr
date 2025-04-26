import { SequenceConf, SequenceGenerator } from 'mgnr-core'
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
      _: '',
      l: this.sequence.length,
      n: this.sequence.numOfNotes,
      den: this.sequence.density,
      dur: convertRange(this.picker.duration),
      vel: convertRange(this.picker.velocity),
      f: this.sequence.conf.fillStrategy,
      p: this.sequence.poly ? 'poly' : 'mono',
      h: this.picker.harmonizer ? this.picker.harmonizer['degree'] : '',
    }
  }
}

type Range = { min: number, max: number }
function convertRange(r: Range | number) {
  if (typeof r === 'number') return r
  else return `${r.min}-${r.max}`
}

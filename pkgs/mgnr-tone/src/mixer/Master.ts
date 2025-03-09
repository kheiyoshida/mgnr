import * as Tone from 'tone'
import { overrideDefault } from 'utils'

export interface MasterChannelConf {
  limitThreshold?: number
  autoLimit?: boolean
  targetRMS?: number
  comp?: {
    threshold: number,
    ratio: number,
  }
}

export class MasterChannel {
  static getDefault() {
    return {
      limitThreshold: -6,
      autoLimit: true,
      targetRMS: -6,
      comp: {
        threshold: -10,
        ratio: 2,
      }
    }
  }

  readonly chNode: Tone.Channel
  readonly gainNode: Tone.Gain
  readonly comp: Tone.Compressor
  readonly limiter: Tone.Limiter
  readonly meter: Tone.Meter
  readonly vol: Tone.Volume

  constructor(options: MasterChannelConf = {}) {
    const { limitThreshold, autoLimit, targetRMS, comp } = overrideDefault(
      MasterChannel.getDefault(),
      options
    )
    this.chNode = new Tone.Channel()
    this.comp = new Tone.Compressor(comp.threshold, comp.ratio)
    this.gainNode = new Tone.Gain(4)
    this.limiter = new Tone.Limiter(limitThreshold)
    this.meter = new Tone.Meter()
    this.vol = new Tone.Volume(-1)
    const dest = Tone.getDestination()
    this.chNode.chain(
      this.comp,
      this.gainNode,
      this.limiter,
      this.meter,
      this.vol,
      dest
    )
    if (autoLimit) {
      this.autoLimit(targetRMS)
    }
  }

  private autoLimit(targetRMS: number) {
    setInterval(() => {
      const r = this.meter.getValue() as number
      if (r > targetRMS) {
        console.warn('RMS exceeded threshold. adjusting...')
        this.limiter.threshold.value -= 1
        this.gainNode.gain.rampTo(this.gainNode.gain.value - 1, '4m')
      }
    }, 100)
  }
}

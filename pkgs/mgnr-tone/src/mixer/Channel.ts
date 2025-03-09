import * as Tone from 'tone'
import { Range } from 'utils'
import { ToneInst } from '../types'
import { Send, Sends } from './Send'

export type ChConf = {
  id?: string
  initialVolume?: number
  effects?: Tone.ToneAudioNode[]
  volumeRange?: Range
}
export type InstChConf<I extends ToneInst = ToneInst> = ChConf & {
  inst: I
}
export type SendChConf = ChConf

export type FadeValues = Parameters<Tone.Param['rampTo']>

export type MuteValue = 'on' | 'off' | 'toggle'

export type ChannelNode = Pick<Tone.ToneAudioNode, 'connect'>

export abstract class Channel {
  readonly effects: Tone.ToneAudioNode[]
  readonly vol: Tone.Volume
  readonly sends = new Sends()
  readonly volumeRange: Range
  readonly id: string | undefined

  get volumeRangeDiff(): number {
    return this.volumeRange.max - this.volumeRange.min
  }

  get isAlreadyMinimumVolume(): boolean {
    return this.vol.volume.value <= this.volumeRange.min
  }

  abstract get first(): ChannelNode

  get last(): ChannelNode {
    return this.vol
  }

  constructor({ effects, initialVolume, volumeRange, id }: ChConf) {
    this.effects = effects || []
    this.volumeRange = volumeRange || { min: -50, max: -10 }
    this.vol = new Tone.Volume(initialVolume)
    this.id = id
  }

  protected connectNodes() {
    let current = this.first
    if (this.effects && this.effects.length) {
      for (const node of this.effects) {
        current.connect(node)
        current = node
      }
    }
    current.connect(this.vol)
  }

  public connectSend(send: Send) {
    this.last.connect(send.gain)
    this.sends.push(send)
  }

  public dynamicVolumeFade(relativeVolume: number | ((v: number) => number), time: FadeValues[1]) {
    this.mute('off')
    const finalValue =
      typeof relativeVolume === 'number'
        ? this.vol.volume.value + relativeVolume
        : relativeVolume(this.vol.volume.value)
    if (finalValue <= this.volumeRange.min) {
      if (this.isAlreadyMinimumVolume) {
        return this.mute('on')
      }
      this.vol.volume.rampTo(this.volumeRange.min, time)
    } else if (finalValue >= this.volumeRange.max) {
      this.vol.volume.rampTo(this.volumeRange.max, time)
    } else {
      this.vol.volume.rampTo(finalValue, time)
    }
  }

  public mute(v: MuteValue) {
    if (v === 'toggle') {
      this.vol.mute = !this.vol.mute
    } else {
      this.vol.mute = v === 'on'
    }
  }

  public dispose() {
    // don't dispose instrument (in case notes are remaining)
    this.effects.forEach((e) => e.dispose())
    this.sends.dispose()
  }
}

export class InstChannel<I extends ToneInst = ToneInst> extends Channel {
  readonly inst: I

  constructor(conf: InstChConf<I>) {
    super(conf)
    this.inst = conf.inst
    this.connectNodes()
  }

  get first(): ToneInst {
    return this.inst
  }
}

export class SendChannel extends Channel {
  readonly ch = new Tone.Channel()

  constructor(conf: SendChConf) {
    super(conf)
    this.connectNodes()
  }

  get first(): Tone.Channel {
    return this.ch
  }
}

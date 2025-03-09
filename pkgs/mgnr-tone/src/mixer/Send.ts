import * as Tone from 'tone'
import { Channel, FadeValues, MuteValue, SendChannel } from './Channel'

export class Sends {
  readonly nodes: Send[] = []

  public push(send: Send) {
    this.nodes.push(send)
  }

  public findSend(to: SendChannel): Send {
    const s = this.nodes.find((n) => n.toCh === to)
    if (!s) {
      throw Error(`could not find send ${to}`)
    }
    return s
  }

  public dispose() {
    this.nodes.forEach(n => n.dispose())
  }
}

export class Send {
  readonly gain: Tone.Gain
  readonly out = new Tone.Channel()

  constructor(amount: number, readonly fromCh: Channel, readonly toCh: SendChannel) {
    this.gain = new Tone.Gain(amount)
    this.gain.connect(this.out)
  }

  public fade(values: FadeValues) {
    this.gain.gain.rampTo(...values)
  }

  public mute(value: MuteValue) {
    if (value === 'toggle') {
      this.out.mute = !this.out.mute
    } else {
      this.out.mute = value === 'on'
    }
  }

  public dispose() {
    this.gain.dispose()
    this.out.dispose()
  }
}

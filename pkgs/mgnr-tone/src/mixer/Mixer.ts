import { removeItemFromArray } from 'utils/src/utils/mutate'
import { Channel, FadeValues, InstChannel, InstChConf, MuteValue, SendChannel, SendChConf } from './Channel'
import { MasterChannel, MasterChannelConf } from './Master'
import { Send } from './Send'
import { ToneInst } from '../types'

export class Mixer {
  readonly channels: Channel[] = []
  readonly master!: MasterChannel

  static singleton: Mixer

  constructor(masterConf: MasterChannelConf = {}) {
    if (Mixer.singleton) return Mixer.singleton
    this.master = new MasterChannel(masterConf)
    Mixer.singleton = this
  }

  createInstChannel<I extends ToneInst>(conf: InstChConf<I>): InstChannel<I> {
    const newCh = new InstChannel(conf)
    this.registerChannel(newCh)
    return newCh
  }

  createSendChannel(conf: SendChConf) {
    const newCh = new SendChannel(conf)
    this.registerChannel(newCh)
    return newCh
  }

  connect(fromCh: Channel, toCh: SendChannel, gainAmount = 0) {
    const send = new Send(gainAmount, fromCh, toCh)
    fromCh.connectSend(send)
    send.out.connect(toCh.first)
  }

  private registerChannel(channel: Channel) {
    if (this.channels.includes(channel)) {
      throw Error(`channel ${channel} already registered`)
    }
    channel.last.connect(this.master.chNode)
    this.channels.push(channel)
  }

  public fadeChannelSend(fromCh: Channel, toCh: SendChannel, v: FadeValues) {
    fromCh.sends.findSend(toCh).fade(v)
  }

  public muteChannelSend(fromCh: Channel, toCh: SendChannel, v: MuteValue) {
    fromCh.sends.findSend(toCh).mute(v)
  }

  public deleteChannel(channel: Channel) {
    removeItemFromArray(this.channels, channel)
    channel.dispose()
  }
}

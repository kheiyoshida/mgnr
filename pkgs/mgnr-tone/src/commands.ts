import { LayeredOutlet, MonoOutlet, ToneOutlet } from './outlet/Outlet'
import { LayeredInstrument } from './instrument'
import { InstChannel } from './mixer/Channel'
import { MasterChannelConf } from './mixer/Master'
import { Mixer } from './mixer/Mixer'
import { ToneInst } from './types'
export { registerEvents as registerTimeEvents } from './timeEvent'

export function getMixer(masterConf: MasterChannelConf = {}) {
  return new Mixer(masterConf)
}

export function createOutlet(inst: ToneInst | InstChannel): ToneOutlet
export function createOutlet(inst: LayeredInstrument, bufferTimeFrame: number): LayeredOutlet
export function createOutlet(inst: ToneInst, bufferTimeFrame: number): MonoOutlet
export function createOutlet(inst: ToneInst | InstChannel, bufferTimeFrame?: number): ToneOutlet {
  const i = inst instanceof InstChannel ? inst.inst : inst
  if (bufferTimeFrame) {
    if (i instanceof LayeredInstrument) return new LayeredOutlet(i, bufferTimeFrame)
    else return new MonoOutlet(i, bufferTimeFrame)
  }
  return new ToneOutlet(i)
}

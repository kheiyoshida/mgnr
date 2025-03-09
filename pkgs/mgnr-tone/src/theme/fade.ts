import { InstChannel } from '../mixer/Channel'
import * as Transport from '../tone-wrapper/Transport'
import { SceneComponentPosition } from './scene'

/**
 * specification for channels that should fade in/out on event
 */
export type InOut = {
  in: PositionOutletMap
  out: PositionOutletMap
}
type PositionOutletMap = Partial<Record<SceneComponentPosition, string>>

export type Duration = `${number}m`

export type FadeSpec = {
  inOrOut: 'in' | 'out'
  instId: string
  duration: Duration
  timing?: Duration
  delay?: Duration
}

export const makeFader = (channels: Record<string, InstChannel>, timing = '@4m', delay = '4m') => {
  return (fadeList: FadeSpec[]) => {
    const fade = () => {
      fadeList.forEach(({ instId, duration, inOrOut }) => {
        const instCh = channels[instId]
        if (!instCh) throw Error(`channel not found: ${instId}`)
        instCh.dynamicVolumeFade(
          inOrOut === 'in' ? instCh.volumeRangeDiff : -instCh.volumeRangeDiff,
          duration
        )
      })
    }
    Transport.scheduleOnce((t) => {
      Transport.scheduleOnce(fade, t + Transport.toSeconds(delay))
    }, timing)
  }
}

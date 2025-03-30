import * as mgnr from '@mgnr/tone'
import { drumMachine, pad, bass } from './instruments'
import * as Tone from 'tone'

export const setupChannels = () => {
  const mixer = mgnr.getMixer()

  const drumCh = mixer.createInstChannel({
    inst: drumMachine(),
    initialVolume: -4,
    effects: [new Tone.BitCrusher(16), new Tone.Chorus(360)],
  })

  const padCh = mixer.createInstChannel({
    inst: pad(),
    initialVolume: -8,
    effects: [new Tone.Distortion(0.1)],
  })

  const bassCh = mixer.createInstChannel({
    inst: bass(),
    initialVolume: -5,
    effects: [new Tone.BitCrusher(16)],
  })

  const sendCh = mixer.createSendChannel({
    effects: [new Tone.Compressor(-8, 8)],
  })

  mixer.connect(drumCh, sendCh, 0.3)
  mixer.connect(bassCh, sendCh, 0.3)

  return { drumCh, padCh, bassCh }
}

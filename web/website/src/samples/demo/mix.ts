import * as mgnr from '@mgnr/tone'
import { drumMachine, pad, bass } from './instruments'
import * as Tone from 'tone'

export const setupChannels = () => {
  const mixer = mgnr.getMixer()

  const drumCh = mixer.createInstChannel({
    inst: drumMachine(),
    initialVolume: -6,
    effects: [new Tone.BitCrusher(16), new Tone.Chorus(360)],
  })

  const padCh = mixer.createInstChannel({
    inst: pad(),
    initialVolume: -6,
    effects: [new Tone.Distortion(0.1)],
  })

  const bassCh = mixer.createInstChannel({
    inst: bass(),
    initialVolume: -10,
    effects: [new Tone.BitCrusher(16)],
  })

  const sendCh = mixer.createSendChannel({
    effects: [new Tone.Compressor(-10, 8)],
  })

  mixer.connect(drumCh, sendCh, 0.3)
  mixer.connect(bassCh, sendCh, 0.3)

  return { drumCh, padCh, bassCh }
}

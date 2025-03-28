import * as mgnr from '@mgnr/tone'
import { drumMachine, pad, synth } from './instruments'
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
    effects: [new Tone.Distortion(0.1), new Tone.PingPongDelay('8n.', 0.2)],
  })

  const synthCh = mixer.createInstChannel({
    inst: synth(),
    initialVolume: -10,
    effects: [new Tone.BitCrusher(16)],
  })

  const sendCh = mixer.createSendChannel({
    effects: [new Tone.Compressor(-10, 8)],
  })

  mixer.connect(drumCh, sendCh, 0.3)
  mixer.connect(synthCh, sendCh, 0.3)

  return { drumCh, padCh, synthCh }
}

import * as Tone from 'tone'

export const makeContextManager = (config: {
  bpm: number
  initialise: () => void
  interval: string
  onInterval: () => void
}) => {
  const startContext = () => {
    if (Tone.context.state === 'suspended') {
      Tone.start()
    }
  }

  let started = false
  const startPlaying = () => {
    if (started) return
    started = true
    Tone.Transport.bpm.value = config.bpm
    Tone.Transport.start()
    config.initialise()
    Tone.Transport.scheduleRepeat(config.onInterval, config.interval, config.interval)
  }

  return {
    startContext,
    startPlaying,
    get started() {
      return started
    },
  }
}

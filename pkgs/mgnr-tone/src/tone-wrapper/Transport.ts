import { Transport } from 'tone'

export function scheduleRepeat(...args: Parameters<typeof Transport.scheduleRepeat>) {
  return Transport.scheduleRepeat(...args)
}

export function scheduleOnce(...args: Parameters<typeof Transport.scheduleOnce>) {
  return Transport.scheduleOnce(...args)
}

export function toSeconds(...args: Parameters<typeof Transport.toSeconds>) {
  return Transport.toSeconds(...args)
}

export function clear(...args: Parameters<typeof Transport.clear>) {
  return Transport.clear(...args)
}

export function setBPM(value: number) {
  Transport.bpm.value = value
}

import * as Transport from './tone-wrapper/Transport'

export type TimeEventHandler = (time: number) => OnceTimeEvent | void

export type TimeEventMap = {
  once?: OnceTimeEvent[]
  repeat?: RepeatTimeEvent[]
}

export type OnceTimeEvent = {
  time: string
  handler: TimeEventHandler
}

export type RepeatTimeEvent = {
  interval: string | number
  start?: string | number
  repeat?: number
  handler: TimeEventHandler
}

export function registerEvents(map: TimeEventMap) {
  if (map.once) {
    map.once.forEach(registerOnce)
  }
  if (map.repeat) {
    map.repeat.forEach(registerRepeat)
  }
}

function registerOnce(event: OnceTimeEvent) {
  Transport.scheduleOnce((time) => {
    const chain = event.handler(time)
    if (chain) {
      next(chain)
    }
  }, event.time)
}

function registerRepeat(event: RepeatTimeEvent) {
  Transport.scheduleRepeat(
    (time) => {
      const chain = event.handler(time)
      if (chain) {
        next(chain)
      }
    },
    event.interval,
    event.start || 0,
    getDuration(event.interval, event.repeat)
  )
}

function next(event: OnceTimeEvent) {
  registerOnce(event)
}

function getDuration(interval: string | number, repeat?: number) {
  if (!repeat) return undefined
  if (typeof interval === 'string') {
    return `${repeat * parseInt(interval.slice(0, interval.length - 1))}m`
  } else {
    return repeat * interval
  }
}

/* eslint-disable no-console */
import { CliScale, CliSequenceGenerator } from '../aliases'
import { LogData } from './types'

export async function setupLogStream(generators: CliSequenceGenerator[], scales: CliScale[]) {
  if (!(await isStreamAvailable())) return

  let time = 0
  const interval = 250
  setInterval(() => {
    time += interval
    void sendStream({
      head: msToMinutesSeconds(time),
      body: {
        p: generators.map((g) => g.logState),
        s: scales.map((s) => s.logState),
      },
    })
  }, interval)
}

async function isStreamAvailable() {
  try {
    await fetch('http://localhost:8080/ping')
    return true
  } catch (e) {
    console.log(`Stream server is not available. You can start stream server by "npx mgnr-cli-stream" in another window for monitoring`)
    return false
  }
}

const STREAM_URL = 'http://localhost:8080/log'

async function sendStream(log: LogData) {
  try {
    await fetch(STREAM_URL, {
      method: 'POST',
      body: JSON.stringify(log),
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(`failed to post log stream: ${(e as Error).message}`)
  }
}

function msToMinutesSeconds(millis: number) {
  const minutes = Math.floor(millis / 60_000).toString()
  const seconds = ((millis % 60_000) / 1000).toFixed()
  return `${zeroFill(minutes)}:${zeroFill(seconds)}`
}

function zeroFill(t: string) {
  return t.length === 1 ? `0${t}` : t
}

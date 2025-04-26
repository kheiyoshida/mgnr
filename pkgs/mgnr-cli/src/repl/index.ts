/* eslint-disable no-console */
import * as repl from 'node:repl'

export function startReplSession(setup: () => Record<string, unknown>) {
  try {
    console.clear()
    const replServer = repl.start()
    const bound = setup()
    Object.assign(replServer.context, bound)
  } catch (err) {
    console.error(err)
  }
}

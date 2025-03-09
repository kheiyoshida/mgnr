import { SequenceGenerator } from './SequenceGenerator'

/**
 * note:
 * if the client were to use subclass of SequenceGenerator,
 * it should cast the type for now
 */
export type SequenceLoopHandler = (
  generator: SequenceGenerator,
  loopNth: number
) => void

export type LoopEvent = {
  elapsed?: SequenceLoopHandler
  ended?: SequenceLoopHandler
}

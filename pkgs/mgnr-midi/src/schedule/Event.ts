import { Time } from './Time'

export type ScheduledEvent = {
  callback: () => void,
  time: Time
}

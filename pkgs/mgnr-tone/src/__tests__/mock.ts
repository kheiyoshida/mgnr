/* eslint-disable no-extra-semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { scheduleLoop } from '../tone-wrapper/utils'

/**
 * simply run callback by provided loop times
 */
export const mockScheduleLoop = (...[cb, _, __, numOfLoops]: Parameters<typeof scheduleLoop>) => {
  ;[...Array(numOfLoops)].map((_, i) => {
    // loopNth starts from 1 
    cb(i, i + 1)
  })
  return 0 // assignId
}

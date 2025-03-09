import * as Transport from './Transport'

export function scheduleLoop(
  cb: (time: number, loopNth: number) => void,
  durartion: number,
  startTime: number,
  numOfLoops: number
) {
  let loopNth = 0
  return Transport.scheduleRepeat(
    (time) => {
      loopNth += 1
      cb(time, loopNth)
    },
    durartion,
    startTime,
    durartion * numOfLoops
  )
}
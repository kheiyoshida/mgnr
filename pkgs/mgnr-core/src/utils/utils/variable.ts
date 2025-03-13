export const makeCounter = () => {
  let current = 0
  return () => {
    current += 1
    return current
  }
}

/**
 * create a store for a number variable that changes everytime client evokes `renew`,
 * where the number tries to "ping-pong" between min and max
 */
export const makePingpongNumberStore = (
  determineAmount: (current: number) => number,
  min: number,
  max: number,
  initial: number
) => {
  let current = initial
  let up = true
  const renew = () => {
    if (current >= max) {
      up = false
    }
    if (current <= min) {
      up = true
    }
    const amount = determineAmount(current)
    current += up ? amount : -amount
  }
  return {
    renew,
    get current() {
      return current
    },
  }
}

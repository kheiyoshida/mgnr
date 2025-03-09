/**
 * generates a funciton that retries provided function when not satisfied
 * can adjust args after each execution
 */
export const retry = <Fn extends (...args: any[]) => any>(
  fn: Fn,
  isOK: (r: ReturnType<Fn>) => boolean,
  maxRetry = 20,
  errMessage = 'exceed max retry times',
  adjust?: (...params: Parameters<Fn>) => Parameters<Fn>,
) => {
  const count = retryCounter(maxRetry, errMessage)
  const f = (...args: Parameters<Fn>): ReturnType<Fn> => {
    count()
    const result = fn(...args)
    return isOK(result)
      ? result
      : adjust
      ? f(...adjust(...args))
      : f(...args)
  }
  return f
}

const retryCounter = (
  maxRetry: number,
  errMessage: string,
) => {
  let r = 0
  const count = () => {
    r += 1
    if (r > maxRetry) throw new Error(errMessage)
  }
  return count
}

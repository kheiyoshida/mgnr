export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * generates function that executes after delaying time
 */
export const makeDelayedFn =
  <R, Fn extends () => R>(ms: number, exec: Fn): (() => Promise<R>) =>
  () =>
    delay(ms).then(exec)

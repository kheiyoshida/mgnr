/* eslint-disable @typescript-eslint/ban-types */

export function pipe<A>(value: A): A
export function pipe<A, B>(value: A, fn1: (input: A) => B): B
export function pipe<A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): C
export function pipe<A, B, C, D>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D
): D
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E
): E
export function pipe(value: unknown, ...fns: Function[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value)
}

/**
 * make sure the function's called once
 * @param fn function to execute
 */
export const once = <A extends unknown[], R, F extends (...args: A) => R>(
  fn: F
): ((...args: A) => R) => {
  let done = false
  return (...args: A) => {
    if (!done) {
      done = true
      return fn(...args)
    }
    throw Error(`once function called twice. Did you mean to use 'memorize()?'`)
  }
}

export const memorize = <T, A extends unknown[]>(calc: (...args: A) => T) => {
  let result: T
  return (...args: A) => {
    if (result === undefined) {
      result = calc(...args)
    }
    return result
  }
}

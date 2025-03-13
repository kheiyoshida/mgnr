/* eslint-disable no-console */

export function comparePerformance(fn1: () => void, fn2: () => void) {
  const iterations = 1_000_000
  console.time('Function #1')
  for (let i = 0; i < iterations; i++) {
    fn1()
  }
  console.timeEnd('Function #1')

  console.time('Function #2')
  for (let i = 0; i < iterations; i++) {
    fn2()
  }
  console.timeEnd('Function #2')
}

import { Time } from './Time'

describe(`${Time.name}`, () => {
  it.each([
    [120, 0, 0],
    [120, 8, 1],
    [120, 12, 1.5],
    [120, 16, 2.0],
    [80, 16, 3.0],
    [60, 8, 2.0],
  ])(`can represent absolute time for the timing in song`, (bpm, index, expected) => {
    Time.bpm = bpm
    const time = new Time(index)
    expect(time.toSeconds()).toBe(expected)
    expect(time.toMillis()).toBe(expected * 1_000)
  })
})

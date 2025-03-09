import { getSemitoneDiffBetweenPitches, pickRandomPitchName } from './utils'

describe('keyDiff', () => {
  it('should be able to calculate degree of note from the provided root', () => {
    expect(getSemitoneDiffBetweenPitches('D#', 'F#')).toBe(3)
    expect(getSemitoneDiffBetweenPitches('A', 'C')).toBe(3)
    expect(getSemitoneDiffBetweenPitches('B', 'C')).toBe(1)
    expect(getSemitoneDiffBetweenPitches('C', 'B')).toBe(11)
  })
})

test(`${pickRandomPitchName}`, () => {
  expect([...Array(100)].map(pickRandomPitchName)).toContain("B")
})

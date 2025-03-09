import { getHarmonicPitch, harmonize } from './Harmonizer'
import { Note } from '../entities'
import { Scale } from '../entities/source'

describe(`${harmonize.name}`, () => {
  it(`can harmonize a note by degrees`, () => {
    const scale = new Scale({})
    const note = {
      pitch: 60,
      dur: 1,
      vel: 100,
    }
    const res = harmonize(note, scale.wholePitches, {
      degree: ['5', '7'],
      force: false,
      lookDown: false,
    })
    expect(res).toMatchObject([
      {
        ...note,
        pitch: 67,
      },
      {
        ...note,
        pitch: 71,
      },
    ])
  })
  it(`cannot harmonize random pitch note`, () => {
    const scale = new Scale({})
    const note: Note = {
      pitch: 'random',
      dur: 1,
      vel: 100,
    }
    const res = harmonize(note, scale.wholePitches, {
      degree: ['5', '7'],
      force: false,
      lookDown: false,
    })
    expect(res).toMatchObject([])
  })
})

describe(`${getHarmonicPitch.name}`, () => {
  it(`can adjust harmonic degree if there's none matching in the scale`, () => {
    const res = getHarmonicPitch(
      { degree: ['b5'], lookDown: false, force: false },
      60,
      6,
      new Scale({ key: 'C' }).wholePitches
    )
    expect(res).toBe(67)
  })
  it(`should return null when none found in the scale`, () => {
    const res = getHarmonicPitch({ degree: ['7'], lookDown: false, force: false }, 60, 11, [])
    expect(res).toBe(null)
  })
  it(`can force picking Nth degree note`, () => {
    const res = getHarmonicPitch(
      { degree: ['b5'], lookDown: false, force: true },
      60,
      6,
      new Scale({}).wholePitches
    )
    expect(res).toBe(66)
  })
  it(`can look down the scale for the Nth degree note`, () => {
    const res = getHarmonicPitch(
      {
        degree: ['5'],
        lookDown: true,
        force: false,
      },
      60,
      7,
      new Scale({}).wholePitches
    )
    expect(res).toBe(53)
  })
})

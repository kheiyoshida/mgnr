import { Note } from 'mgnr-core'
import { convertToConcreteNote, convertToMidiNote } from './convert'
import { Scale } from 'mgnr-core/src'
import { NumRange } from 'utils'

describe(`${convertToConcreteNote.name}`, () => {
  it(`should convert random pitch into concrete pitch`, () => {
    const scale = new Scale()
    jest.spyOn(scale, 'pickRandomPitch').mockReturnValue(65)
    const note: Note = {
      pitch: 'random',
      dur: 1,
      vel: 100,
    }
    expect(convertToConcreteNote(scale, note)).toMatchObject({
      ...note,
      pitch: 65,
    })
  })
  it(`should convert ranged values into concrete values`, () => {
    const scale = new Scale()
    const note = {
      pitch: 60,
      dur: {
        min: 1,
        max: 4,
      },
      vel: {
        min: 50,
        max: 100,
      },
    }
    const result = convertToConcreteNote(scale, note)
    expect(new NumRange(note.dur).includes(result.dur)).toBe(true)
    expect(new NumRange(note.vel).includes(result.vel)).toBe(true)
  })
})

test(`${convertToMidiNote.name}`, () => {
  const result = convertToMidiNote(1, {
    pitch: 60,
    vel: 100,
    dur: 1,
  })
  expect(result).toMatchObject({
    velocity: 100,
    note: 60,
    channel: 0,
  })
})

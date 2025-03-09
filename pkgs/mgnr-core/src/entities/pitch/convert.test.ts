import { C1 } from './constants'
import { convertMidiToNoteName, convertNoteNameToMidi } from './convert'

describe(`${convertMidiToNoteName.name}`, () => {
  it(`should convert midi number to NOTE OCTAVE format`, () => {
    expect(convertMidiToNoteName(C1)).toBe('C1')
    expect(convertMidiToNoteName(60)).toBe('C4')
    expect(convertMidiToNoteName(63)).toBe('D#4')
  })
})

describe(`${convertNoteNameToMidi.name}`, () => {
  it(`should convert note to midi number`, () => {
    expect(convertNoteNameToMidi('C4')).toBe(60)
    expect(convertNoteNameToMidi('D#4')).toBe(63)
  })
  it(`should reject unsupported notes`, () => {
    expect(() => convertNoteNameToMidi('C10')).toThrow()
    expect(() => convertNoteNameToMidi('C0')).toThrow()
    expect(() => convertNoteNameToMidi('D#10')).toThrow()
  })
})

import { Scale } from './Scale'
import { OCTAVE } from '../index'

describe(`${Scale.name}`, () => {
  describe(`note construction`, () => {
    it(`should construct note pool from key and range`, () => {
      const scale = new Scale({
        key: 'C',
        range: { min: 60, max: 60 + OCTAVE * 3 },
      })
      expect(scale.primaryPitches).toMatchObject([
        60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 95, 96,
      ])
    })
    it(`should detect error range and fallback to default`, () => {
      const scale = new Scale({
        key: 'C',
        range: { min: 0, max: 30 },
      })
      expect(scale.primaryPitches).toMatchObject([24, 26, 28, 29])
    })
    it(`can set preferred degree in the key`, () => {
      const scale = new Scale({
        key: 'D#',
        pref: 'omit27',
        range: { min: 60, max: 90 },
      })
      expect(scale.primaryPitches).toMatchObject([60, 63, 67, 68, 70, 72, 75, 79, 80, 82, 84, 87])
    })
    it(`should throw if the pitches would be empty`, () => {
      expect(() => {
        new Scale({
          key: 'F',
          pref: '_1M',
          range: {
            min: 49,
            max: 51,
          },
        })
      }).toThrow()
    })
    it(`can be constructed with fixed pitches`, () => {
      const scale = new Scale([60, 62, 64])
      expect(scale.primaryPitches).toMatchObject([60, 62, 64])
    })
  })
  describe(`${Scale.prototype.pickRandomPitch.name}`, () => {
    it(`should pick random note from the range`, () => {
      const scale = new Scale({ key: 'C', range: { min: 60, max: 80 } })
      const n = scale.pickRandomPitch()
      expect(n! >= 60 && n! <= 80).toBe(true)
    })
  })
  describe(`${Scale.prototype.pickNearestPitch.name}`, () => {
    it(`can pick nearest note in the scale for a note`, () => {
      const scale = new Scale({ key: 'C', pref: 'major' })
      expect(scale.pickNearestPitch(61, 'down')).toBe(60)
      expect(scale.pickNearestPitch(61, 'up')).toBe(62)
    })
    it(`should return the note as is when it couldn't find any note`, () => {
      const scale = new Scale({ key: 'C', range: { min: 61, max: 66 } })
      expect(scale.pickNearestPitch(61, 'down')).toBe(61)
      expect(scale.pickNearestPitch(66, 'up')).toBe(66)
    })
  })
  describe(`${Scale.prototype.modulate.name}`, () => {
    it(`can gradually change notes to the destination scale`, () => {
      const scale = new Scale({
        key: 'C',
        pref: 'major',
        range: { min: 60, max: 72 },
      })
      expect(scale.primaryPitches).toMatchObject([60, 62, 64, 65, 67, 69, 71, 72])
      scale.modulate({ key: 'F' }, 2)
      expect(scale.primaryPitches).toMatchObject([60, 62, 64, 65, 67, 69, 72])
      scale.modulate()
      expect(scale.primaryPitches).toMatchObject([60, 62, 64, 65, 67, 69, 70, 72])
      expect(scale.key).toBe('F')
      expect(scale.inModulation).toBe(false)
    })
    it(`should change notes immediately if stages < 2`, () => {
      const scale = new Scale({
        key: 'C',
        pref: 'major',
        range: { min: 60, max: 72 },
      })
      expect(scale.primaryPitches).toMatchObject([60, 62, 64, 65, 67, 69, 71, 72])
      scale.modulate({ key: 'F' }, 1)
      expect(scale.primaryPitches).toMatchObject([60, 62, 64, 65, 67, 69, 70, 72])
      expect(scale.key).toBe('F')
      expect(scale.inModulation).toBe(false)
    })
    it(`can change its pitch range`, () => {
      const scale = new Scale({
        key: 'C',
        range: { min: 60, max: 60 + OCTAVE * 3 },
      })
      const beforeNotes = scale.primaryPitches.slice()
      scale.modulate({ range: { min: 60, max: 60 + OCTAVE * 1 } })
      expect(scale.primaryPitches).not.toMatchObject(beforeNotes)
      expect(scale.primaryPitches).toMatchObject([60, 62, 64, 65, 67, 69, 71, 72])
    })
    it(`can change scale type`, () => {
      const scale = new Scale({
        key: 'D#',
        pref: 'omit27',
        range: { min: 60, max: 90 },
      })
      const beforeNotes = scale.primaryPitches.slice()
      scale.modulate({ pref: 'omit47' })
      expect(scale.primaryPitches).not.toMatchObject(beforeNotes)
      expect(scale.primaryPitches).toMatchObject([60, 63, 65, 67, 70, 72, 75, 77, 79, 82, 84, 87, 89])
    })
    it(`should cancel modulation if there's no change`, () => {
      const scale = new Scale({
        key: 'C',
        pref: 'omit27',
        range: { min: 60, max: 72 },
      })
      expect(scale.primaryPitches).toMatchObject([60, 64, 65, 67, 69, 72])
      scale.modulate({ key: 'F', pref: 'omit46' }, 3)
      expect(scale.key).toBe('F')
      expect(scale.primaryPitches).toMatchObject([60, 64, 65, 67, 69, 72])
      expect(scale.inModulation).toBe(false)
    })
    it(`should cancel modulation if the next config would end up with empty scale`, () => {
      const scale = new Scale()
      const originalPitches = scale.primaryPitches.slice()
      scale.modulate(
        {
          key: 'F',
          pref: '_1M',
          range: {
            min: 49,
            max: 51,
          },
        },
        4
      )
      expect(scale.inModulation).toBe(false)
      expect(scale.primaryPitches).toMatchObject(originalPitches)
    })
    it(`should consume next modulation queue if scale was to get empty`, () => {
      const scale = new Scale({ key: 'C', pref: '_1M', range: { min: 64, max: 67 } })
      expect(scale.primaryPitches).toMatchObject([64, 67])
      expect(() => {
        scale.modulate(
          {
            key: 'D',
          },
          6
        )
        scale.modulate()
      }).not.toThrow()
    })
  })
})

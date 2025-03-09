import {
  adjustNotePitch,
  fillNoteConf,
  harmonizeNote,
  pickHarmonizedNotes,
  pickNote,
} from './NotePicker'
import { Scale } from '../entities/source/Scale'

describe(`${pickHarmonizedNotes.name}`, () => {
  it(`should pick harmonzied note`, () => {
    const scale = new Scale()
    jest.spyOn(scale, 'pickRandomPitch').mockReturnValue(60)
    const conf = fillNoteConf({ harmonizer: { degree: ['5'] } })
    const notes = pickHarmonizedNotes(conf, scale)
    expect(notes!.map((n) => n.pitch)).toMatchObject([60, 67])
  })
  it(`should not return anything when pickNote failed`, () => {
    const scale = new Scale()
    const conf = fillNoteConf({ harmonizer: { degree: ['5'] } })
    jest.spyOn(scale, 'pickRandomPitch').mockReturnValue(undefined as unknown as number)
    expect(pickHarmonizedNotes(conf, scale)).toBe(undefined)
  })
  it(`should return the picked note when hamonize was not enabled`, () => {
    const res = pickHarmonizedNotes(fillNoteConf({}), new Scale())
    expect(res).toHaveLength(1)
  })
})

describe(`${pickNote.name}`, () => {
  it(`should pick runtime random note if strategy is "random"`, () => {
    const noteDur = { min: 2, max: 4 }
    const conf = fillNoteConf({
      pitchStrategy: 'randomPerLoop',
      durationStrategy: 'randomInRange',
      duration: noteDur,
      velocity: 100,
    })
    const note = pickNote(conf, new Scale())
    expect(note?.pitch).toBe('random')
    expect(note?.dur).toBe(noteDur)
    expect(note?.vel).toBe(100)
  })
  it(`should pick note with concrete values if strategy is "fixed"`, () => {
    const noteDur = { min: 2, max: 4 }
    const conf = fillNoteConf({
      pitchStrategy: 'fixed',
      durationStrategy: 'fixed',
      duration: noteDur,
      velocity: 100,
    })
    const note = pickNote(conf, new Scale())
    expect(note?.pitch).not.toBe('random')
    expect(note?.dur).toBeLessThanOrEqual(noteDur.max)
    expect(note?.dur).toBeGreaterThanOrEqual(noteDur.min)
    expect(note?.vel).toBe(100)
  })
})

test(`${harmonizeNote.name}`, () => {
  const conf = fillNoteConf({ harmonizer: { degree: ['5'] } })
  const harmonized = harmonizeNote({ pitch: 60, vel: 100, dur: 1 }, conf, new Scale())
  expect(harmonized[0].pitch).toBe(67)
})

describe(`${adjustNotePitch.name}`, () => {
  it(`should adjust the pitch if given note is not in current scale`, () => {
    const scale = new Scale({})
    const nearest = jest.spyOn(scale, 'pickNearestPitch')
    const conf = fillNoteConf({})
    adjustNotePitch(
      {
        pitch: 61,
        dur: 1,
        vel: 100,
      },
      scale,
      conf
    )
    expect(nearest).toHaveBeenCalled()
  })
})

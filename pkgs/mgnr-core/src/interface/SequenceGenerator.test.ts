import * as utils from 'utils'
import { SequenceGenerator } from './SequenceGenerator'
import * as mw from '../features/middleware'
import { changeSequenceLength, constructNotes, updateConfig } from '../features/middleware'
import { fillNoteConf, harmonizeNote } from '../features/NotePicker'
import { Scale, Sequence, SequenceNoteMap } from '../entities'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils'),
}))

const scale = new Scale({
  key: 'C',
  range: { min: 60, max: 80 },
  pref: 'major',
})

const defaultNotes: SequenceNoteMap = {
  0: [
    {
      dur: 1,
      pitch: 60,
      vel: 100,
    },
  ],
  2: [
    {
      dur: 1,
      pitch: 62,
      vel: 100,
    },
  ],
  4: [
    {
      dur: 1,
      pitch: 80,
      vel: 100,
    },
    {
      dur: 1,
      pitch: 72,
      vel: 100,
    },
  ],
}

const monoNotes: SequenceNoteMap = {
  ...defaultNotes,
  3: [
    {
      dur: 1,
      pitch: 72,
      vel: 100,
    },
  ],
  4: [
    {
      dur: 1,
      pitch: 80,
      vel: 100,
    },
  ],
}

const deepCopy = <T>(v: T) => JSON.parse(JSON.stringify(v)) as T

describe(`${updateConfig.name}`, () => {
  it(`should update config with given fields & values`, () => {
    const picker = fillNoteConf({ duration: { min: 1, max: 4 } })
    const scale = new Scale()
    const sequence = new Sequence({ density: 0.5, length: 8 })
    const context ={ picker, sequence, scale }
    updateConfig(context, {
      sequence: {
        density: 0.9,
      },
    })
    expect(sequence.density).toBe(0.9)
    updateConfig(context, {
      note: {
        duration: 2,
      },
    })
    expect(context.picker.duration).toBe(2)
  })
})

describe(`${constructNotes.name}`, () => {
  it(`should assign initial notes if provided`, () => {
    const picker = fillNoteConf({})
    const sequence = new Sequence({ fillStrategy: 'fixed' })
    const context = ({ picker, sequence, scale: new Scale() })
    constructNotes(context, defaultNotes)
    expect(context.sequence.notes).toMatchObject(defaultNotes)
  })
  it(`should harmonize initial notes when harmonizer enabled`, () => {
    const picker = fillNoteConf({ harmonizer: { degree: ['5'] } })
    const sequence = new Sequence({ fillStrategy: 'fixed' })
    const context = ({ picker, sequence, scale: new Scale() })
    constructNotes(context, monoNotes)
    sequence.iterateNotesAtPosition((notesAtPos) => {
      expect(notesAtPos[1]).toMatchObject(harmonizeNote(notesAtPos[0], picker, scale)[0])
    })
  })
  it(`should fill up available space after assigning initial notes`, () => {
    const picker = fillNoteConf({ duration: 1 })
    const sequence = new Sequence({
      fillStrategy: 'fill',
      polyphony: 'mono',
      length: 8,
      density: 0.5,
    })
    const context = ({ picker, sequence, scale })
    const initialNotes = { 0: defaultNotes[0].slice() }
    constructNotes(context, initialNotes)
    expect(context.sequence.numOfNotes).toBe(sequence.density * sequence.length) // 4 notes
    expect(context.sequence.notes).toMatchObject(expect.objectContaining(initialNotes))
  })
})

describe(`${changeSequenceLength.name}`, () => {
  it(`can extend its sequence length, filling the extended part with notes`, () => {
    const picker = fillNoteConf({ duration: 1 })
    const sequence = new Sequence({
      fillStrategy: 'fill',
      polyphony: 'mono',
      length: 8,
      density: 0.5,
    })
    const context = ({ picker, sequence, scale })
    changeSequenceLength(context, 'extend', 8)
    expect(sequence.length).toBe(16)
    expect(sequence.numOfNotes).toBe(sequence.density * sequence.length)
  })
  it(`can shrink and remove excessive notes after shrinking`, () => {
    const picker = fillNoteConf({ duration: 1 })
    const sequence = new Sequence({
      fillStrategy: 'fill',
      polyphony: 'mono',
      length: 8,
      density: 0.5,
    })
    const generator = new SequenceGenerator({ picker, sequence, scale })
    generator.changeSequenceLength('shrink', 4)
    expect(generator.sequence.length).toBe(4)
    sequence.iterateEachNote((_, position) => {
      expect(position).toBeLessThan(sequence.length)
    })
  })
  it('should not extend/shrink beyond lenRange', () => {
    const lenRange = { min: 4, max: 12 }
    const picker = fillNoteConf({})
    const sequence = new Sequence({ length: 8, lenRange })
    const generator = new SequenceGenerator({ picker, sequence, scale })
    expect(generator.sequence.length).toBe(8)
    // 8 -> 14 x
    generator.changeSequenceLength('extend', 6)
    expect(sequence.length).toBe(8)
    // 8 -> 2 x
    generator.changeSequenceLength('shrink', 6)
    expect(sequence.length).toBe(8)
    // 8 -> 6 o
    generator.changeSequenceLength('shrink', 2)
    expect(sequence.length).toBe(6)
    // 6 -> 10 o
    generator.changeSequenceLength('extend', 4)
    expect(sequence.length).toBe(10)
  })
})

describe(`${mw.mutate.name}`, () => {
  beforeEach(() => {
    jest.spyOn(utils, 'randomRemoveFromArray').mockImplementation((notes) => [notes.slice(1, 2), [notes[0]]]) // all removed except the second note
  })
  it(`can randomize existing notes`, () => {
    const picker = fillNoteConf({})
    const sequence = new Sequence({ length: 8, density: 0.5 })
    const generator = new SequenceGenerator({ picker, sequence, scale })
    generator.constructNotes(defaultNotes)
    const before = { ...sequence.notes }
    generator.mutate({ rate: 1, strategy: 'randomize' })
    const after = sequence.notes
    expect(after).not.toMatchObject(before)
    expect(after[4].includes(before[4][1])).toBe(true) // survived note
  })
  it(`can move the existing notes to random position preserving pitch/dur/vel`, () => {
    const picker = fillNoteConf({})
    const sequence = new Sequence({ fillStrategy: 'fixed' })
    const generator = new SequenceGenerator({ picker, sequence, scale })
    generator.constructNotes(monoNotes)
    const before = deepCopy({ ...generator.sequence.notes })
    generator.mutate({ rate: 1, strategy: 'move' })
    const after = generator.sequence.notes
    expect(after).not.toMatchObject(before)
    expect(() =>
      // should find moved note somewhere
      sequence.iterateEachNote((note) => {
        let found = false
        Sequence.iterateEachNote(before, (beforeNote) => {
          if (note.pitch === beforeNote.pitch && note.dur === beforeNote.dur && note.vel === beforeNote.vel) {
            found = true
          }
        })
        if (!found) {
          throw Error()
        }
      })
    ).not.toThrow()
  })
  it(`can randomly alter note's pitch in place`, () => {
    const picker = fillNoteConf({})
    const sequence = new Sequence({ polyphony: 'mono', length: 8, density: 0.5 })
    const generator = new SequenceGenerator({ picker, sequence, scale })
    generator.constructNotes(defaultNotes)
    const beforeNotes = deepCopy({ ...sequence.notes })
    generator.mutate({ rate: 1, strategy: 'inPlace' })
    expect(sequence.notes).not.toMatchObject(beforeNotes)
    sequence.iterateNotesAtPosition((afterNotes, pos) => {
      expect(afterNotes[0]).not.toMatchObject(beforeNotes[pos][0])
      expect(afterNotes[0].pitch).not.toBe(beforeNotes[pos][0].pitch)
    })
  })
})

describe(`${mw.adjustPitch.name}`, () => {
  it(`can adjust notes on scale changes`, () => {
    const scale = new Scale({ key: 'C', pref: '_1M' })
    const picker = fillNoteConf({})
    const sequence = new Sequence({ polyphony: 'mono', length: 8, density: 0.5 })
    const generator = new SequenceGenerator({ picker, sequence, scale })
    generator.constructNotes()
    sequence.iterateEachNote((note) => {
      expect(scale.primaryPitches.includes(note.pitch as number)).toBe(true)
    })
    scale.modulate({ key: 'D', pref: '_1M' }, 1)
    generator.adjustPitch()
    sequence.iterateEachNote((note) => {
      expect(scale.primaryPitches.includes(note.pitch as number)).toBe(true)
    })
  })
})

describe(`${mw.eraseSequenceNotes.name}`, () => {
  const sequence = new Sequence({ polyphony: 'mono' })
  const picker = fillNoteConf({})
  const generator = new SequenceGenerator({ picker, sequence, scale })
  generator.constructNotes()
  expect(sequence.numOfNotes).toBe(8)
  generator.eraseSequenceNotes()
  expect(sequence.numOfNotes).toBe(0)
})

describe(`${mw.resetNotes.name}`, () => {
  it(`can reset notes`, () => {
    const picker = fillNoteConf({})
    const sequence = new Sequence()
    const generator = new SequenceGenerator({ picker, sequence, scale })
    generator.constructNotes()
    const firstFill = generator.sequence.notes
    generator.resetNotes()
    const secondFill = generator.sequence.notes
    expect(secondFill).not.toMatchObject(firstFill)
  })
})

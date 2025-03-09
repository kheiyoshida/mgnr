import { Sequence } from './Sequence'
import { Note } from './Note'
import * as utils from 'utils'

jest.mock('utils', () => ({
  __esModule: true,
  ...jest.requireActual('utils')
}))

const notes = {
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

const makeNotes = () => JSON.parse(JSON.stringify(notes))

const makeNote = (dur: Note['dur']) => ({
  dur,
  pitch: 60,
  vel: 60,
})

describe(`${Sequence.name}`, () => {
  describe(`fluent fields`, () => {
    test(`conf aliases`, () => {
      const seq = new Sequence({
        length: 4,
        lenRange: { min: 4, max: 12 },
        division: 8,
        density: 0.3,
      })
      expect(seq.length).toBe(4)
      expect(seq.lenRange.min).toBe(4)
      expect(seq.lenRange.max).toBe(12)
      expect(seq.division).toBe(8)
    })
    test(`max number of notes`, () => {
      expect(new Sequence({ length: 4, density: 0.5 }).maxNumOfNotes).toBe(2)
      expect(new Sequence({ length: 4, density: 0.3 }).maxNumOfNotes).toBe(1)
      expect(new Sequence({ length: 3, density: 0.3 }).maxNumOfNotes).toBe(0)
    })
    describe(`used space`, () => {
      it(`should count total length of notes`, () => {
        const seq = new Sequence({ length: 8, density: 0.5 })
        seq.replaceEntireNotes({
          0: [makeNote(2), makeNote(1)],
          2: [makeNote(1)],
        })
        expect(seq.usedSpace).toBe(4)
      })
      it(`should count take max length of ranged notes`, () => {
        const seq = new Sequence({ length: 8, density: 0.5 })
        seq.replaceEntireNotes({
          0: [makeNote(2), makeNote(1)],
          2: [makeNote({ min: 1, max: 4 })],
        })
        expect(seq.usedSpace).toBe(7)
      })
    })
    test(`number of measure`, () => {
      expect(new Sequence({ length: 20, division: 16 }).numOfMeasures).toBe(1.25)
      expect(new Sequence({ length: 5, division: 16 }).numOfMeasures).toBe(0.3125)
    })
    test(`isEmpty`, () => {
      const seq = new Sequence()
      expect(seq.isEmpty).toBe(true)
      seq.addNote(0, makeNote(1))
      expect(seq.isEmpty).toBe(false)
    })
    test(`number of notes`, () => {
      const seq = new Sequence()
      seq.replaceEntireNotes({
        0: [makeNote(4), makeNote(2)],
      })
      expect(seq.numOfNotes).toBe(2)
    })
  })
  test(`${Sequence.prototype.updateConfig.name}`, () => {
    const seq = new Sequence({density: 0.5})
    seq.updateConfig({density: 0.9})
    expect(seq.density).toBe(0.9)
  })
  describe(`${Sequence.prototype.addNote.name}`, () => {
    it(`should put note in specified position`, () => {
      const seq = new Sequence()
      const note = makeNote(2)
      seq.addNote(0, note)
      expect(seq.notes).toMatchObject({
        0: [note],
      })
    })
    it(`should not delete the existing notes in position`, () => {
      const seq = new Sequence()
      const note = makeNote(2)
      seq.addNote(0, note)
      const note2 = makeNote(3)
      seq.addNote(0, note2)
      expect(seq.notes).toMatchObject({
        0: [note, note2],
      })
    })
  })
  test(`${Sequence.prototype.addNotes.name}`, () => {
    const seq = new Sequence()
    const notes = [makeNote(1), makeNote(3)]
    seq.addNotes(0, notes)
    expect(seq.notes).toMatchObject({
      0: notes,
    })
  })
  test(`${Sequence.prototype.replaceEntireNotes.name}`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    const note: Note = {
      dur: 1,
      pitch: 80,
      vel: 100,
    }
    seqNotes.addNote(0, note)
    expect(seqNotes.notes[0][1]).toMatchObject(note)
    seqNotes.addNote(3, note)
    expect(seqNotes.notes[3][0]).toMatchObject(note)
  })
  test(`${Sequence.prototype.replaceNotesInPosition.name}`, () => {
    const seq = new Sequence()
    seq.addNote(0, makeNote(1))
    const newNotes = [makeNote(4), makeNote(3)]
    seq.replaceNotesInPosition(0, newNotes)
    expect(seq.notes).toMatchObject({
      0: newNotes,
    })
  })
  test(`${Sequence.prototype.deleteEntireNotes.name}`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.deleteEntireNotes()
    expect(seqNotes.numOfNotes).toBe(0)
  })
  test(`${Sequence.prototype.deleteNotesInPosition.name}`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.deleteNotesInPosition(0)
    seqNotes.deleteNotesInPosition(4)
    expect(seqNotes.notes).toMatchObject({ 2: notes[2] })
  })
  test(`${Sequence.prototype.deleteNoteFromPosition.name}`, () => {
    const sequence = new Sequence()
    sequence.replaceEntireNotes(makeNotes())
    const [note, ...rest] = sequence.notes[4]
    sequence.deleteNoteFromPosition(4, note)
    expect(sequence.notes[4]).toMatchObject(rest)
  })
  test(`${Sequence.prototype.deleteRandomNotes.name}`, () => {
    jest.spyOn(utils, 'randomRemoveFromArray').mockImplementation((notes) => {
      if (notes.length > 1)
        return [
          [notes[0]], // survive
          notes.slice(1), // removed
        ]
      else return [[], notes] // all removed
    })
    const sequence = new Sequence()
    sequence.replaceEntireNotes(makeNotes())
    const before = { ...sequence.notes }
    const removed = sequence.deleteRandomNotes(1) // 1 does nothing
    const after = sequence.notes
    expect(after).not.toMatchObject(before)
    expect(after).toMatchObject({
      '4': [
        {
          dur: 1,
          pitch: 80,
          vel: 100,
        },
      ],
    })
    expect(removed).toMatchObject([
      {
        dur: 1,
        pitch: 60,
        vel: 100,
      },
      {
        dur: 1,
        pitch: 62,
        vel: 100,
      },
      {
        dur: 1,
        pitch: 72,
        vel: 100,
      },
    ])
  })
  test(`${Sequence.prototype.getAvailablePosition.name}`, () => {
    const currentNotes = makeNotes()
    const alreadyUsed = Object.keys(currentNotes).map((k) => Number(k))
    const seqNotes = new Sequence({ polyphony: 'mono' })
    seqNotes.replaceEntireNotes(currentNotes)
    for (let i = 0; i < 50; i++) {
      const res = seqNotes.getAvailablePosition()
      expect(typeof res).toBe('number')
      expect(alreadyUsed.includes(res as number)).not.toBe(true)
    }
  })

  test(`${Sequence.prototype.iteratePosition.name}`, () => {
    // 1
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.iteratePosition((pos) => seqNotes.deleteNotesInPosition(pos))
    expect(seqNotes.notes).toMatchInlineSnapshot(`{}`)
    // 2
    const seqNotes2 = new Sequence()
    seqNotes2.replaceEntireNotes(makeNotes())
    expect(seqNotes2.notes[0]).toHaveLength(1)
    seqNotes2.iteratePosition((pos) => seqNotes2.notes[pos].forEach((n) => (n.pitch = 72)))
    expect(seqNotes2.iteratePosition((p) => seqNotes2.notes[p].forEach((n) => n.pitch === 72)))
  })
  test(`${Sequence.prototype.iterateEachNote.name}`, () => {
    const seqNotes = new Sequence()
    seqNotes.replaceEntireNotes(makeNotes())
    seqNotes.iterateEachNote((n) => (n.pitch = 72))
    expect(seqNotes.iteratePosition((p) => seqNotes.notes[p].forEach((n) => n.pitch === 72)))
  })
  test(`${Sequence.prototype.iterateNotesAtPosition.name}`, () => {
    const seq = new Sequence()
    seq.replaceEntireNotes(makeNotes())
    const fn = jest.fn()
    seq.iterateNotesAtPosition(fn)
    expect(fn).toHaveBeenCalledTimes(3)
  })
})

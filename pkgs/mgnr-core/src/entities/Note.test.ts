import { makeCreateNotes, makeCreateNote, mergeNoteMap } from "./Note"
import { SequenceNoteMap } from "./Sequence"


test(`${makeCreateNote.name}`, () => {
  expect(makeCreateNote(1, 100)(60)).toEqual({
    pitch: 60,
    dur: 1,
    vel: 100,
  })
})

test(`${makeCreateNotes.name}`, () => {
  expect(makeCreateNotes()(60, 62)).toEqual([
    { pitch: 60, dur: 1, vel: 100 },
    { pitch: 62, dur: 1, vel: 100 },
  ])
})

test(`${makeCreateNotes.name}`, () => {
  const n = makeCreateNotes()
  const map1:SequenceNoteMap = {
    0: n(60),
    4: n(60),
  }
  const map2:SequenceNoteMap = {
    2: n(90),
    4: n(90),
  }
  expect(mergeNoteMap(map1, map2)).toEqual({
    0: n(60),
    2: n(90),
    4: n(60, 90),
  })
})
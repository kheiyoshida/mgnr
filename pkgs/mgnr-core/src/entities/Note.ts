import { Range } from 'utils'
import { MidiNum } from './pitch'
import { Sequence, SequenceNoteMap } from './Sequence'

type RANDOM = 'random'

export type Note = {
  pitch: MidiNum | RANDOM
  dur: number | Range
  vel: number | Range
}

const defaultVelocity = 100
const defaultDuration = 1

export const makeCreateNote =
  (dur: Note['dur'] = defaultDuration, vel: Note['vel'] = defaultVelocity) =>
  (pitch: Note['pitch']): Note => ({ pitch, dur, vel })

export const makeCreateNotes =
  (createNote = makeCreateNote()) =>
  (...pitches: MidiNum[]): Note[] =>
    pitches.map(createNote)

export const mergeNoteMap = (...sequences: SequenceNoteMap[]): SequenceNoteMap => {
  const newMap: SequenceNoteMap = {}
  sequences.forEach((seq) => {
    Sequence.iterateNotesAtPosition(seq, (notes, pos) => {
      if (newMap[pos]) {
        newMap[pos] = newMap[pos].concat(notes)
      } else {
        newMap[pos] = notes
      }
    })
  })
  return newMap
}

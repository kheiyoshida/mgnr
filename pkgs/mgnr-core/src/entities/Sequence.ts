import {
  normalizeRange,
  overrideDefault,
  randomIntInclusiveBetween,
  randomRemoveFromArray,
  Range,
} from 'utils'
import { Note } from './Note'

export type SequenceConf = {
  length: number
  lenRange: Range

  /**
   * density of notes that fill this sequence
   * float 0 - 1
   */
  density: number

  /**
   * if notes are fixed regardless of density setting
   */
  fillStrategy: 'fill' | 'fixed'

  /**
   * minimum unit of note duration
   * e.g. duration=2 note with division 16 means 8th note
   */
  division: SeqDivision

  /**
   * if set to 'poly', sequence can have multiple notes at the same time
   */
  polyphony: Polyphony
}

type SeqDivision = 16 | 8 | 4 | 2 | 1

type Polyphony = 'mono' | 'poly'

export type SequenceNoteMap = {
  [position: number]: Note[]
}

export class Sequence {
  private _notes: SequenceNoteMap = {}
  public get notes(): SequenceNoteMap {
    return this._notes
  }

  private _conf: SequenceConf
  get conf() {
    return this._conf
  }

  get poly() {
    return this._conf.polyphony === 'poly'
  }

  get length(): number {
    return this._conf.length
  }

  get lenRange() {
    return this._conf.lenRange
  }

  get division() {
    return this._conf.division
  }

  get density(): number {
    return this._conf.density
  }

  get availableSpace() {
    return this.maxNumOfNotes - this.usedSpace
  }

  get maxNumOfNotes() {
    return Math.floor(this.length * this.density)
  }

  get usedSpace() {
    let used = 0
    this.iterateEachNote((note) => {
      used += normalizeRange(note.dur)
    })
    return used
  }

  /**
   * number of measures for a loop of sequence.
   * e.g. length20 / division16 = 1.25 measures
   */
  get numOfMeasures(): number {
    return this.length / this.division
  }

  get isEmpty() {
    return this.numOfNotes === 0
  }

  /**
   * note this is different from `usedSpace`.
   * it doesn't care note length
   */
  get numOfNotes() {
    let num = 0
    this.iterateEachNote(() => (num += 1))
    return num
  }

  static DefaultConf: SequenceConf = {
    length: 16,
    lenRange: {
      min: 2,
      max: 50,
    },
    fillStrategy: 'fill',
    division: 16,
    density: 0.5,
    polyphony: 'poly',
  }

  constructor(conf: Partial<SequenceConf> = {}) {
    this._conf = overrideDefault(Sequence.DefaultConf, conf)
  }

  public updateConfig(conf: Partial<SequenceConf>) {
    this._conf = overrideDefault(this._conf, conf)
  }

  public addNote(pos: number | undefined, note: Note) {
    if (pos === undefined || pos >= this.length) return
    if (this.notes[pos]) {
      this.notes[pos].push(note)
    } else {
      this.notes[pos] = [note]
    }
  }

  public addNotes(pos: number | undefined, notes: Note[]) {
    for (const n of notes) {
      this.addNote(pos, n)
    }
  }

  public replaceEntireNotes(notes: SequenceNoteMap) {
    this._notes = notes
  }

  public replaceNotesInPosition(position: number, notes: Note[]) {
    if (!notes || !notes.length) {
      throw Error(`replaceNotes called with empty notes`)
    }
    this.notes[position] = notes
  }

  public deleteEntireNotes() {
    this._notes = {}
  }

  public deleteNotesInPosition(position: number) {
    if (this.notes[position]) {
      delete this.notes[position]
    }
  }

  public deleteNoteFromPosition(position: number, note: Note) {
    if (this.notes[position]) {
      this.notes[position] = this.notes[position].filter((n) => n !== note)
    }
  }

  public deleteRandomNotes(rate: number): Note[] {
    let removed: Note[] = []
    this.iteratePosition((i) => {
      const [survived, rm] = randomRemoveFromArray(this.notes[i], rate)
      if (survived.length) {
        this.replaceNotesInPosition(i, survived)
      } else {
        this.deleteNotesInPosition(i)
      }
      removed = removed.concat(rm)
    })
    return removed
  }

  private searchEmptyPosition(n = 0): number | undefined {
    const seqLen = this.length
    if (n > 50) {
      // there's no available position
      return
    }
    const pos = randomIntInclusiveBetween(0, seqLen - 1)
    if (this.notes[pos]) {
      return this.searchEmptyPosition(n + 1)
    }
    return pos
  }

  /**
   * get available position for a note.
   * if poly allowed, just returns random position
   */
  public getAvailablePosition() {
    return this._conf.polyphony === 'mono'
      ? this.searchEmptyPosition()
      : randomIntInclusiveBetween(0, this.length - 1)
  }

  public canExtend(byLength: number) {
    return this.lenRange.max > this.length + byLength
  }

  public extend(len: number) {
    this._conf.length += len
  }

  public canShrink(byLength: number) {
    return this.length > byLength && this.length - byLength >= this.lenRange.min
  }

  public shrink(len: number) {
    this._conf.length -= len
  }

  static iteratePosition(noteMap: SequenceNoteMap, cb: (position: number) => void) {
    Object.keys(noteMap)
      .map((p) => parseInt(p))
      .forEach(cb)
  }

  static iterateNotesAtPosition(noteMap: SequenceNoteMap, cb: (notes: Note[], position: number) => void) {
    Object.keys(noteMap)
      .map((p) => parseInt(p))
      .forEach((p) => cb(noteMap[p], p))
  }

  static iterateEachNote(noteMap: SequenceNoteMap, cb: (note: Note, position: number) => void) {
    Sequence.iterateNotesAtPosition(noteMap, (notesAtPos, position) =>
      notesAtPos.forEach((note) => cb(note, position))
    )
  }

  public iteratePosition(cb: (position: number) => void) {
    Sequence.iteratePosition(this.notes, cb)
  }

  public iterateNotesAtPosition(cb: (notes: Note[], position: number) => void) {
    Sequence.iterateNotesAtPosition(this.notes, cb)
  }

  public iterateEachNote(cb: (note: Note, position: number) => void) {
    Sequence.iterateEachNote(this.notes, cb)
  }
}

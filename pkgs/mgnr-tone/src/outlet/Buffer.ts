import { Range } from "utils"
import { findWithinRangeItem } from "../instrument"

export type BufferedNote = {
  pitch: number
  time: number
  duration: number
  velocity: number
}

export class NoteBuffer {
  private buffer: BufferedNote[] = []
  constructor(private timeFrame: number) {}
  insert(note: BufferedNote) {
    const index = findIndexBackwards(this.buffer, note)
    if (index !== null) this.buffer.splice(index, 0, note)
  }
  consume(currentTime: number): BufferedNote[] {
    const threshold = currentTime + this.timeFrame
    const lastNoteIndex = this.buffer.findLastIndex(n => n.time < threshold)
    const notes = this.buffer.slice(0, lastNoteIndex + 1).filter(n => n.time >= currentTime)
    this.buffer = this.buffer.slice(lastNoteIndex + 1)
    return notes
  }
}

export const findIndexBackwards = (notes: BufferedNote[], note: BufferedNote): number | null => {
  for (let i = notes.length - 1; i >= 0; i--) {
    if (notes[i].time < note.time) return i + 1
    if (Math.round(notes[i].time * 100) === Math.round(note.time * 100)) return null
  }
  return 0
}

export type RangeBuffer = Range & {
  buffer: NoteBuffer
}

export class LayeredNoteBuffer {
  #buffers: RangeBuffer[]
  constructor(timeFrame: number, pitchRanges: Range[]) {
    this.#buffers = pitchRanges.map(range => ({ ...range, buffer: new NoteBuffer(timeFrame) }))
  }
  insert(note: BufferedNote) {
    const buffer = findWithinRangeItem(this.#buffers, note.pitch)
    if (buffer) buffer.buffer.insert(note)
  }
  consume(currentTime: number): BufferedNote[][] {
    return this.#buffers.map(b => b.buffer.consume(currentTime))
  }
}

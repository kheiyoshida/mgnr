import {
  C1,
  Degree,
  DEGREE_NUM_MAP,
  PitchName,
  PITCH_NAMES,
  MidiNum,
  NoteName,
  Semitone,
} from './constants'

export const convertMidiToNoteName = (midiNum: MidiNum): NoteName => {
  if (!midiNum) {
    throw Error(`invalid midi num: ${midiNum}`)
  }
  const noteName = PITCH_NAMES[midiNum % 12]
  const octave = Math.floor(midiNum / 12) - 1
  return `${noteName}${octave}`
}

export const convertDegreeToSemitone = (degree: Degree | Semitone): Semitone => {
  if (typeof degree === 'number') {
    return degree
  }
  return DEGREE_NUM_MAP[degree]
}

export const convertNoteNameToMidi = (noteName: NoteName): MidiNum => {
  const { noteIdx, octave } = splitNoteName(noteName)
  return C1 + noteIdx + (octave - 1) * 12
}

/**
 * split note name into `NoteName` and octave
 */
const splitNoteName = (note: string) => {
  if (note.length > 3) {
    throw Error(
      `Note name should be 2-3 characters. 
      Currently not supporting notes higher than C10`
    )
  }

  const noteName = note.slice(0, note.length - 1)
  const idx = PITCH_NAMES.indexOf(noteName as PitchName)
  if (idx == -1) {
    throw Error(`Tone name not found`)
  }

  const oct = note.slice(note.length - 1)
  const octave = Number(oct)
  if (Number.isNaN(octave)) {
    throw Error(`Octave couldn't be converted to number`)
  } else if (octave == 0) {
    throw Error(`Octave doesn't support 0`)
  }

  return {
    noteName,
    noteIdx: idx,
    octave,
  }
}

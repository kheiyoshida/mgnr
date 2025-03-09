
/**
 * alphabetically represented pitches(C,D,E…)
 */
export type PitchName = (typeof PITCH_NAMES)[number]
export const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const


/**
 * `PitchName` with octave number (C3, C4, C5,...)
 */
export type NoteName = string

/**
 * Semitone for 8th degree(octave)
 */
export const OCTAVE = 12

export const C1 = 24

/**
 * map for the lowest midi number of each pitch
 */
export const ROOT_TONE_MAP = Object.fromEntries(PITCH_NAMES.map((t, i) => [t, C1 + i])) as {
  [n in PitchName]: number
}

/**
 * alphabetically represented degrees(1, b1, 2, b3…)
 */
export type Degree = (typeof DEGREES)[number]
export const DEGREES = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'a5', '6', 'b7', '7'] as const


/**
 * 12 number of degrees (0,1,2…11)
 */
export type Semitone = number

/**
 * map for `Degree`(string) and `Semitone`(number)
 */
export const DEGREE_NUM_MAP = Object.fromEntries(DEGREES.map((d, i) => [d, i])) as {
  [d in Degree]: Semitone
}

/**
 * midi number for a certain pitch (e.g. 60 for C4)
 */
export type MidiNum = number
export const LOWEST_MIDI_NUM = 24
export const HIGHEST_MIDI_NUM = 120
export const WHOLE_OCTAVES = 8

import { Semitone } from '../index'

export type ScaleType = keyof typeof SCALES
export type SemitonesInScale = readonly Semitone[]
export const SCALES = {
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  major: [0, 2, 4, 5, 7, 9, 11],
  omit47: [0, 2, 4, 7, 9],
  omit46: [0, 2, 4, 7, 11],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  omit27: [0, 4, 5, 7, 9],
  omit25: [0, 4, 5, 9, 11],
  power: [0, 7],
  _1M: [0, 4, 7],
  _1m: [0, 3, 7],
} as const

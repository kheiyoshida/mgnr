import { Range } from '../calc'

/**
 * 2 numbers tuple.
 * used for grid/matrix position, and coords of the screen
 */
export type Position = [number, number]

export const reducePosition = (p1: Position, p2: Position): Position => [
  p1[0] + p2[0],
  p1[1] + p2[1],
]

/**
 * check if position's values are within range
 */
export const validatePosition = (
  [v1, v2]: Position,
  { min, max }: Partial<Range>
): Position | null => {
  if (min !== undefined && (v1 < min || v2 < min)) return null
  if (max !== undefined && (v1 > max || v2 > max)) return null
  return [v1, v2]
}

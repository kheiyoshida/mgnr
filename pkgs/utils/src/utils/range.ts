type Range = [min: number, max: number]

export const makeRangeMap = <T>(
  rangesAndValues: [Range, T][],
  fallback: T = rangesAndValues[rangesAndValues.length - 1][1]
) => {
  const getInRange = (numInRange: number): T => {
    const found = rangesAndValues.find(([range]) => numInRange >= range[0] && numInRange <= range[1])
    if (found) {
      return found[1]
    }
    return fallback
  }
  return {
    get: getInRange,
  }
}

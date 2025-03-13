export const makeCycle = (maxVal: number, minVal = 0) => {
  if (maxVal < minVal) throw Error(`maxVal should be greater`)
  const range = maxVal - minVal
  return (value: number) => {
    if (value >= maxVal) return (value % range) + minVal
    else if (value < minVal) return range + value + minVal
    return value
  }
}

export const makeNormalizeValueInRange = (min: number, max: number) => (value: number) => {
  if (value < min) return 0
  if (value > max) return 1
  const range = max - min
  const diff = value - min
  return diff / range
}

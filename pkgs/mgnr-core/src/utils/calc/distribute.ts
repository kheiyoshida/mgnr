export const distribute = (value: number, by: number) => {
  const v = value / by
  return [...new Array(by)].map((_, i) => i * v)
}

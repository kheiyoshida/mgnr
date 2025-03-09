export const validateInt = (int: number): number => {
  if (!Number.isInteger(int)) {
    throw Error(`float recieved where it should be int: ${int}`)
  }
  return int
}


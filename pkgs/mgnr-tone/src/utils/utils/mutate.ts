
export const removeItemFromArray = <T>(arr: T[], del: T) => {
  const i = arr.indexOf(del)
  if (i == -1) {
    throw Error(`could not find item`)
  }
  arr.splice(i, 1)
}
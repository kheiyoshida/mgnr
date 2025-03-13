import { validateInt } from "./validate"

export const createOneStartArray = (n: number): number[] => {
  return [...Array(validateInt(n) + 1).keys()].slice(1)
}

export const getDivisors = (n: number): number[] => {
  return createOneStartArray(n).filter((i) => n % i === 0)
}

export const getFloatDivisors = (num: number, precision = 1, resultLimit = 10): number[] => {
  validateInt(precision)
  validateInt(resultLimit)
  if (precision > 3) {
    throw Error(`getFloatDivisors: precision should not greater than 3`)
  }
  const pow = Math.pow(10, precision)
  return [...Array(pow * (num + 1)).keys()]
    .slice(1)
    .map((i) => Number((i / pow).toFixed(2)))
    .filter((i) => num % i === 0 && i >= 1)
    .slice(0, resultLimit)
}

export const getCommonDivisors = (a: number, b: number): number[] => {
  return getDivisors(a).filter((a) => getDivisors(b).includes(a))
}

export const getCommonFloatDivisors = (a: number, b: number, precision = 1, resultLimit = 10) => {
  return getFloatDivisors(a, precision, resultLimit).filter((a) =>
    getFloatDivisors(b, precision, resultLimit).includes(a)
  )
}

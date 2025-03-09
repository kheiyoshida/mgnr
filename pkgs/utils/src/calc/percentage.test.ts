import { roundFloatPercent, toFloatPercent } from "./percentage";

test(`${roundFloatPercent.name}`, () => {
  expect(roundFloatPercent(40.473284723847)).toBe(40.47)
})

test(`${toFloatPercent.name}`, () => {
  expect(toFloatPercent(35)).toBe(0.35)
})
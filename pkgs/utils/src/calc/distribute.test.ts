import { distribute } from "./distribute";

test(`${distribute.name}`, () => {
  expect(distribute(360, 3)).toMatchObject([0, 120, 240])
})
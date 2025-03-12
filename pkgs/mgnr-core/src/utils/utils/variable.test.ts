import { makePingpongNumberStore, makeCounter } from "./variable";

test(`${makeCounter.name}`, () => {
  const counter = makeCounter()
  expect(counter()).toBe(1)
  expect(counter()).toBe(2)
  expect(counter()).toBe(3)
})

test(`${makePingpongNumberStore.name}`, () => {
  const pingpong = makePingpongNumberStore(() => 3, 0, 10, 5)
  expect(pingpong.current).toBe(5)
  pingpong.renew()
  expect(pingpong.current).toBe(8)
  pingpong.renew()
  expect(pingpong.current).toBe(11)
  pingpong.renew()
  expect(pingpong.current).toBe(8)
  pingpong.renew()
  expect(pingpong.current).toBe(5)
  pingpong.renew()
  expect(pingpong.current).toBe(2)
  pingpong.renew()
  expect(pingpong.current).toBe(-1)
  pingpong.renew()
  expect(pingpong.current).toBe(2)
})
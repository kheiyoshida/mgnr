import * as mgnr from './commands'
import { Mixer } from './mixer/Mixer'
jest.mock('tone')

jest.mock('./tone-wrapper/Transport')

test(`${mgnr.getMixer.name}`, () => {
  expect(mgnr.getMixer() instanceof Mixer).toBe(true)
})

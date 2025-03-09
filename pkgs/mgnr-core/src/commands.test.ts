import * as mgnr from './commands'
import { Scale } from './entities/source'

test(`${mgnr.createScale.name}`, () => {
  expect(() => mgnr.createScale('C')).not.toThrow()
  expect(() => mgnr.createScale({})).not.toThrow()
  expect(() => mgnr.createScale({ key: 'C', pref: 'major', range: { min: 30, max: 80 } })).not.toThrow()
})

test(`${mgnr.createGenerator.name}`, () => {
  const generator = mgnr.createGenerator({
    sequence: {
      polyphony: 'mono',
    },
    scale: new Scale({ key: 'D' }),
  })
  expect(generator).toHaveProperty('sequence')
})

import { createScaleSource } from './Source'

test(`source can create scales based on its source config`, () => {
  const source = createScaleSource({ key: 'C', pref: 'omit27', range: { min: 60, max: 72 } })
  const scale = source.createScale()
  expect(scale.primaryPitches).toEqual([60, 64, 65, 67, 69, 72])
})

test(`each scale can override its source config`, () => {
  const source = createScaleSource({ key: 'C', pref: 'omit27', range: { min: 60, max: 72 } })
  const scale = source.createScale({ range: { min: 66, max: 76 } })
  expect(scale.primaryPitches).toEqual([67, 69, 72, 76])
})

test(`it can modulate its child scales`, () => {
  const source = createScaleSource({ key: 'C', pref: 'omit27', range: { min: 60, max: 72 } })
  source.createScale()
  source.createScale()

  source.modulateAll({ key: 'G', pref: 'omit47' }, 4)
  expect(source.conf).toEqual({ key: 'G', pref: 'omit47', range: { min: 60, max: 72 } })
  expect(source.scales.every((s) => s.inModulation)).toBe(true)

  source.modulateAll()
  expect(source.scales.every((s) => s.inModulation)).toBe(true)

  source.modulateAll()
  expect(source.scales.every((s) => s.inModulation)).toBe(true)

  // complete the modulation
  source.modulateAll()
  expect(source.scales.every((s) => s.inModulation)).toBe(false)
})

test(`it holds child scales except for disposed ones`, () => {
  const source = createScaleSource({ key: 'C', pref: 'omit27', range: { min: 60, max: 72 } })
  const s1 = source.createScale()
  const s2 = source.createScale()
  expect(source.scales).toHaveLength(2)
  s1.dispose()
  expect(source.scales).toHaveLength(1)
  expect(source.scales[0]).toMatchObject(s2)
})

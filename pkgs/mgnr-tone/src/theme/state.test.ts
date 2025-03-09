import * as Tone from 'tone'
import { createOutlet } from '../commands'
import { GeneratorSpec, Scene, SceneComponent } from './scene'
import { ActiveComponents, checkDiff, createMusicState } from './state'
import * as stateModule from './state'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('../tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../tone-wrapper/Transport')>(
    '../tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
  scheduleOnce: (cb: (time: number) => void, time: number) => {
    cb(time)
  }
}))

const createMusicOutlets = () => ({
  synth: createOutlet(new Tone.Synth()),
  tom: createOutlet(new Tone.MembraneSynth()),
})

const FixedStartTime = 0

const generatorSpec = (override?: Partial<GeneratorSpec>) =>
  ({
    generator: {},
    loops: 4,
    onElapsed: () => undefined,
    onEnded: () => undefined,
    ...override,
  }) as GeneratorSpec

it(`can apply scene component`, () => {
  const outlets = createMusicOutlets()
  const state = createMusicState(outlets)

  const component: SceneComponent = {
    outId: 'synth',
    generators: [generatorSpec()],
  }
  const result = state.applyScene(
    {
      top: component,
    },
    FixedStartTime
  )
  expect(state.active.top).not.toBeNull()
  expect(state.active.top?.ports).toHaveLength(1)
  expect(result.in.top).toBe('synth')
})

it(`should override port when there's already an active ones`, () => {
  const outlets = createMusicOutlets()
  const state = createMusicState(outlets)
  const spyOverride = jest.spyOn(stateModule, 'overridePort')

  // 1
  state.applyScene(
    {
      top: { outId: 'synth', generators: [generatorSpec(), generatorSpec()] },
    },
    FixedStartTime
  )
  // 2nd
  const newSpec = generatorSpec({ loops: 2 })
  state.applyScene(
    {
      top: {
        outId: 'synth',
        generators: [newSpec],
      },
    },
    FixedStartTime
  )

  expect(state.active.top).not.toBeNull()
  expect(state.active.top?.ports).toHaveLength(1) // one port has been dropped
  expect(state.active.top?.ports[0].numOfLoops).toBe(0) // -> becomes 2 on next onElapsed
  expect(spyOverride).toHaveBeenCalledWith(state.active.top?.ports[0], newSpec)
})

it(`should deactivate the component if it's absent in the next scene`, () => {
  const outlets = createMusicOutlets()
  const state = createMusicState(outlets)

  state.applyScene(
    {
      top: { outId: 'synth', generators: [generatorSpec()] },
    },
    FixedStartTime
  )
  expect(state.active.top).not.toBeNull()

  const activePort = state.active.top!.ports[0]
  const spyStop = jest.spyOn(activePort, 'stopLoop')

  state.applyScene(
    {
      bottom: { outId: 'tom', generators: [generatorSpec()] },
    },
    FixedStartTime
  )
  expect(spyStop).toHaveBeenCalled()
  expect(state.active.top).toBeNull()
  expect(state.active.bottom).not.toBeNull()
})

it(`should replace the component if next component specifies different outlet`, () => {
  const outlets = createMusicOutlets()
  const state = createMusicState(outlets)

  state.applyScene(
    {
      top: { outId: 'synth', generators: [generatorSpec()] },
    },
    FixedStartTime
  )
  expect(state.active.top).not.toBeNull()

  const activePort = state.active.top!.ports[0]
  const spyStop = jest.spyOn(activePort, 'stopLoop')

  state.applyScene(
    {
      top: { outId: 'tom', generators: [generatorSpec()] },
    },
    FixedStartTime
  )
  expect(spyStop).toHaveBeenCalled()
  expect(state.active.top).not.toBeNull()
  expect(state.active.top!.component.outId).toBe('tom')
})

describe(`${checkDiff.name}`, () => {
  it(`should detect activated outlet`, () => {
    const active: ActiveComponents = {
      top: null,
      bottom: null,
      right: null,
      left: null,
      center: null,
    }
    const scene: Scene = {
      top: { outId: 'synth', generators: [generatorSpec()] },
    }
    const result = checkDiff(active, scene)
    expect(result).toEqual({
      in: { top: 'synth' },
      out: {},
    })
  })
  it(`should detect deactivated outlet`, () => {
    const active: ActiveComponents = {
      top: {
        ports: [],
        component: { outId: 'synth', generators: [generatorSpec()] },
      },
      bottom: null,
      right: null,
      left: null,
      center: null,
    }
    const scene: Scene = {
      // top is absent
      bottom: { outId: 'tom', generators: [generatorSpec()] },
    }
    const result = checkDiff(active, scene)
    expect(result).toEqual({
      out: { top: 'synth' },
      in: { bottom: 'tom' },
    })
  })
  it(`should detect superseded outlet`, () => {
    const active: ActiveComponents = {
      top: {
        ports: [],
        component: { outId: 'synth', generators: [generatorSpec()] },
      },
      bottom: null,
      right: null,
      left: null,
      center: null,
    }
    const scene: Scene = {
      top: { outId: 'another-synth', generators: [generatorSpec()] },
    }
    const result = checkDiff(active, scene)
    expect(result).toEqual({
      out: { top: 'synth' },
      in: { top: 'another-synth' },
    })
  })
})

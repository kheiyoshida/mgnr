import { createGenerator, SequenceGenerator } from 'mgnr-core'
import * as Transport from '../tone-wrapper/Transport'
import { ToneOutlet } from '../outlet/Outlet'
import { ToneOutletPort } from '../outlet/OutletPort'
import { GeneratorSpec, Scene, SceneComponent, SceneComponentPosition } from './scene'
import { InOut } from './fade'

export type ActiveComponents = Record<SceneComponentPosition, ActiveComponentState | null>
type ActiveComponentState = {
  ports: ToneOutletPort[]
  component: SceneComponent
}

export const createMusicState = (outlets: Record<string, ToneOutlet>) => {
  const activeComponents: ActiveComponents = {
    top: null,
    bottom: null,
    right: null,
    left: null,
    center: null,
  }

  const applyScene = (scene: Scene, nextStart = Transport.toSeconds('@4m')): InOut => {
    const inOut = checkDiff(activeComponents, scene)
    const positions: SceneComponentPosition[] = ['top', 'bottom', 'right', 'left', 'center']
    positions.forEach((position) => {
      const shouldDrop = inOut.out[position] !== undefined
      if (shouldDrop) {
        if (!activeComponents[position]) throw Error(`active[${position}] is null`)
        activeComponents[position]!.ports.forEach(cancelPort)
        activeComponents[position] = null
      }
      if (scene[position]) {
        if (!scene[position]) throw Error(`scene[${position}] is null`)
        applyComponent(position, scene[position]!, nextStart)
      }
    })
    return inOut
  }

  const applyComponent = (
    position: SceneComponentPosition,
    nextComponent: SceneComponent,
    nextStart: number
  ) => {
    const activeComponent = activeComponents[position]
    if (activeComponent) {
      activeComponent.ports.forEach((p) => p.stopLoop())
    }
    const newPorts: ToneOutletPort[] = []
    nextComponent.generators.forEach((spec, i) => {
      const port = activeComponent?.ports[i]
      if (port) {
        overridePort(port, spec)
        newPorts.push(port)
      } else {
        const outlet = outlets[nextComponent.outId]
        if (!outlet) throw Error(`outlet ${nextComponent.outId} not found`)
        newPorts.push(createNewPortForOutlet(outlet, spec, nextStart))
      }
    })
    activeComponents[position] = {
      ports: newPorts,
      component: nextComponent,
    }
  }

  return {
    get active() {
      return activeComponents
    },
    applyScene,
  }
}

export const overridePort = (port: ToneOutletPort, spec: GeneratorSpec) => {
  const override = (g: SequenceGenerator) => {
    g.updateConfig(spec.generator)
    g.adjustNotes(spec.notes)
    port.numOfLoops = spec.loops
    port.onElapsed(spec.onElapsed)
    port.onEnded(spec.onEnded)
  }
  port.onEnded(override)
}

export const cancelPort = (port: ToneOutletPort) => {
  Transport.scheduleOnce(() => {
    port.stopLoop()
  }, '+24m')
}

export const createNewPortForOutlet = (
  outlet: ToneOutlet,
  spec: GeneratorSpec,
  start: number
): ToneOutletPort => {
  // TODO: make this compatible with subclass of SequenceGenerator
  const newGenerator = createGenerator({
    ...spec.generator,
    notes: spec.notes,
  })
  return outlet
    .assignGenerator(newGenerator)
    .loopSequence(spec.loops, start)
    .onElapsed(spec.onElapsed)
    .onEnded(spec.onEnded)
}

export const checkDiff = (activeComponents: ActiveComponents, nextScene: Scene): InOut => {
  const inOut: InOut = { in: {}, out: {} }
  Object.keys(activeComponents).forEach((p) => {
    const position = p as SceneComponentPosition
    const activeComponent = activeComponents[position]
    const sceneComponent = nextScene[position]
    if (activeComponent && sceneComponent) {
      if (activeComponent.component.outId !== sceneComponent.outId) {
        inOut.in[position] = sceneComponent.outId
        inOut.out[position] = activeComponent.component.outId
      }
    } else if (activeComponent && !sceneComponent) {
      inOut.out[position] = activeComponent.component.outId
    } else if (!activeComponent && sceneComponent) {
      inOut.in[position] = sceneComponent.outId
    }
  })
  return inOut
}

import { Scale, ScaleConf } from './Scale'

export interface ScaleSource {
  conf: ScaleConf
  scales: Scale[]
  createScale: (conf?: Partial<ScaleConf>) => Scale
  modulateAll: typeof Scale.prototype.modulate
  inModulation: boolean
}

export const createScaleSource = (sourceConf: ScaleConf): ScaleSource => {
  let scales: Scale[] = []
  const cleanup = () => (scales = scales.filter((s) => !s.isDisposed))

  const createScale = (subsetConf: Partial<ScaleConf> = {}): Scale => {
    const scale = new Scale({ ...sourceConf, ...subsetConf })
    scales.push(scale)
    return scale
  }
  const modulateAll: typeof Scale.prototype.modulate = (conf, stages) => {
    cleanup()
    if (!inModulation()) {
      // initiate new mod
      sourceConf = { ...sourceConf, ...conf }
      scales.forEach((scale) => scale.modulate(conf, stages))
    } else {
      // finish off ongoing modulations
      scales.forEach((scale) => {
        if (scale.inModulation) {
          scale.modulate(conf, stages)
        }
      })
    }
  }
  const inModulation = () => scales.some((s) => s.inModulation)
  return {
    get conf() {
      return sourceConf
    },
    get scales() {
      cleanup()
      return scales
    },
    createScale,
    modulateAll,
    get inModulation() {
      return inModulation()
    },
  }
}

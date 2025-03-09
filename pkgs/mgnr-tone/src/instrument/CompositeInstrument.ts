import { convertNoteNameToMidi } from 'mgnr-core'
import { InputNode, NoiseSynth } from 'tone'
import { Frequency, Time } from 'tone/build/esm/core/type/Units'
import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'
import { Range } from 'utils'
import { ToneInst } from '../types'

export class CompositeInstrument implements ToneInst {
  private instruments: ToneInst[]
  constructor(...instruments: ToneInst[]) {
    this.instruments = instruments
  }
  triggerAttackRelease(
    note: Frequency,
    duration: Time,
    time?: Time | undefined,
    velocity?: number | undefined
  ): Instrument<InstrumentOptions> {
    this.instruments.forEach((instrument) => {
      if (instrument instanceof NoiseSynth) {
        // maybe we should avoid this
        instrument.triggerAttackRelease(duration, time, velocity)
      } else {
        instrument.triggerAttackRelease(note, duration, time, velocity)
      }
    })
    return this.instruments[0] as Instrument<InstrumentOptions> // satisfy compiler
  }
  connect(destination: InputNode): Instrument<InstrumentOptions> {
    this.instruments.forEach((instrument) => instrument.connect(destination))
    return this.instruments[0] as Instrument<InstrumentOptions>
  }
}

type RangedInst = Range & {
  inst: ToneInst
}

export class LayeredInstrument implements ToneInst {
  constructor(public instruments: RangedInst[]) {}
  triggerAttackRelease(
    note: Frequency,
    duration: Time,
    time?: Time | undefined,
    velocity?: number | undefined
  ): Instrument<InstrumentOptions> {
    if (typeof note !== 'string') throw Error(`not acceptable`)
    const pitch = convertNoteNameToMidi(note)
    const layer = findWithinRangeItem(this.instruments, pitch)
    if (layer) {
      if (layer.inst instanceof NoiseSynth) {
        layer.inst.triggerAttackRelease(duration, time, velocity)
      } else {
        layer.inst.triggerAttackRelease(note, duration, time, velocity)
      }
    }
    return this.instruments[0].inst as Instrument<InstrumentOptions>
  }
  connect(destination: InputNode): Instrument<InstrumentOptions> {
    this.instruments.forEach((inst) => inst.inst.connect(destination))
    return this.instruments[0].inst as Instrument<InstrumentOptions>
  }
}

export const findWithinRangeItem = <T extends Range>(arr: T[], value: number) => {
  return arr.find((item) => value >= item.min && value <= item.max)
}

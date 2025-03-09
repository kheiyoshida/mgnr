import { Instrument, InstrumentOptions } from 'tone/build/esm/instrument/Instrument'

/**
 * mutate to satisfy when passing through channel and outlet
 */
export type ToneInst = Pick<Instrument<InstrumentOptions>, 'triggerAttackRelease' | 'connect'>


import * as Tone from 'tone'
import { getMixer } from '../commands'
import * as Transport from '../tone-wrapper/Transport'
import { makeFader } from './fade'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('../tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../tone-wrapper/Transport')>('../tone-wrapper/Transport'),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,

  // call callback immediately for testing
  scheduleOnce: (cb: (time: number) => void, time: number) => {
    cb(time)
  },
}))

afterEach(jest.clearAllMocks)

describe(`${makeFader.name}`, () => {
  it(`should schedule fade-in/out at the next fade timing with specified delay`, () => {
    const mixer = getMixer()
    const synCh = mixer.createInstChannel({
      inst: new Tone.MonoSynth(),
    })
    const channels = {
      synth: synCh,
    }

    jest.spyOn(Transport, 'scheduleOnce')
    jest.spyOn(synCh, 'dynamicVolumeFade').mockImplementation(() => undefined)

    const [timing, delay] = ['@4m', '4m']
    const fade = makeFader(channels, timing, delay)

    fade([{inOrOut: 'in', instId: 'synth', duration: '16m'}])

    // scheduleOnce to schedule
    expect(Transport.scheduleOnce).toHaveBeenCalledWith(expect.any(Function), timing)

    // schedule fade in
    expect(Transport.scheduleOnce).toHaveBeenCalledWith(expect.any(Function), timing + Transport.toSeconds(delay))

    // scheduled fade
    expect(channels.synth.dynamicVolumeFade).toHaveBeenCalledWith(expect.any(Number), '16m')
  })
})

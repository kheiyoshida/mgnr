import { Delay, PingPongDelay, PolySynth } from 'tone'
import { Mixer } from './Mixer'
jest.mock('tone')

describe(`${Mixer}`, () => {
  beforeEach(() => {
    Mixer.singleton = undefined as unknown as Mixer
  })
  test(`${Mixer.prototype.createInstChannel.name}`, () => {
    const mixer = new Mixer()
    const ch = mixer.createInstChannel({
      inst: new PolySynth(),
      effects: [],
    })
    expect(mixer.channels.includes(ch)).toBe(true)
  })
  test(`${Mixer.prototype.createSendChannel.name}`, () => {
    const mixer = new Mixer()
    const ch = mixer.createSendChannel({
      effects: [new Delay()],
    })
    expect(mixer.channels.includes(ch)).toBe(true)
  })
  test(`${Mixer.prototype.connect.name}`, () => {
    const mixer = new Mixer()
    const synCh = mixer.createInstChannel({
      inst: new PolySynth(),
      effects: [],
    })
    const delayCh = mixer.createSendChannel({
      effects: [new Delay()],
    })
    mixer.connect(synCh, delayCh, 1)
    expect(synCh.sends.nodes.length).toBe(1)
  })
  test(`${Mixer.prototype.fadeChannelSend.name}`, () => {
    const mixer = new Mixer()
    const instCh = mixer.createInstChannel({
      inst: new PolySynth(),
    })
    const sendCh = mixer.createSendChannel({
      effects: [new PingPongDelay()],
    })
    mixer.connect(instCh, sendCh, 1)
    const fade = jest.spyOn(instCh.sends.nodes[0], 'fade').mockImplementation()
    mixer.fadeChannelSend(instCh, sendCh, [0.2, '2m', 0])
    expect(fade).toHaveBeenCalledWith([0.2, '2m', 0])
  })
  test(`${Mixer.prototype.muteChannelSend.name}`, () => {
    const mixer = new Mixer()
    const instCh = mixer.createInstChannel({
      inst: new PolySynth(),
    })
    const sendCh = mixer.createSendChannel({
      effects: [new PingPongDelay()],
    })
    mixer.connect(instCh, sendCh, 1)
    const mute = jest.spyOn(instCh.sends.nodes[0], 'mute').mockImplementation()
    mixer.muteChannelSend(instCh, sendCh, 'on')
    expect(mute).toHaveBeenCalledWith('on')
  })
  test(`${Mixer.prototype.deleteChannel.name}`, () => {
    const mixer = new Mixer()
    const instCh = mixer.createInstChannel({ inst: new PolySynth() })
    const spyDispose = jest.spyOn(instCh, 'dispose').mockImplementation()
    mixer.deleteChannel(instCh)
    expect(mixer.channels).toHaveLength(0)
    expect(spyDispose).toHaveBeenCalled()
  })
})

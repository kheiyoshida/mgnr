/* eslint-disable no-extra-semi */
import * as Tone from 'tone'
import { ToneInst } from '../types'
import { Channel, InstChannel, SendChannel } from './Channel'
import { Send } from './Send'
jest.mock('tone')

describe(`${Channel.name}`, () => {
  const mockVolumeNode = () => {
    ;(Tone.Volume as any).mockImplementation((initialVolume: number) => {
      return {
        volume: {
          rampTo: jest.fn(),
          value: initialVolume,
          mute: false,
        },
      }
    })
  }
  
  class FakeChannel extends Channel {
    get first(): ToneInst | Tone.Channel {
      throw new Error('Method not implemented.')
    }
  }
  
  it(`should set volume range`, () => {
    const volumeRange = { min: -20, max: 0 }
    const channel = new FakeChannel({ effects: [], volumeRange })
    expect(channel.volumeRange).toMatchObject(volumeRange)
  })
  test(`${Channel.prototype.connectSend.name}`, () => {
    const channel = new FakeChannel({ effects: [] })
    const channel2 = new SendChannel({ effects: [] })
    const send = new Send(1, channel, channel2)
    channel.connectSend(send)
    expect(channel.sends.nodes[0]).toMatchObject(send)
  })
  describe(`${Channel.prototype.dynamicVolumeFade.name}`, () => {
    beforeEach(mockVolumeNode)
    it(`can fade with relative value`, () => {
      const channel = new FakeChannel({ volumeRange: { min: -20, max: 0 }, initialVolume: -10 })
      const spyRampTo = jest.spyOn(channel.vol.volume, 'rampTo')
      channel.dynamicVolumeFade(-2, '2m')
      expect(spyRampTo).toHaveBeenCalledWith(-12, '2m')
    })
    it(`can fade with function`, () => {
      const channel = new FakeChannel({ volumeRange: { min: -20, max: 0 }, initialVolume: -10 })
      const spyRampTo = jest.spyOn(channel.vol.volume, 'rampTo')
      channel.dynamicVolumeFade((vol) => vol / 2, '2m')
      expect(spyRampTo).toHaveBeenCalledWith(-5, '2m')
    })
    it(`shouldn't exceed volume range`, () => {
      const channel = new FakeChannel({ volumeRange: { min: -20, max: 0 }, initialVolume: -15 })
      const spyRampTo = jest.spyOn(channel.vol.volume, 'rampTo')
      channel.dynamicVolumeFade(-10, '2m')
      expect(spyRampTo).toHaveBeenCalledWith(-20, '2m')
    })
  })
  describe(`${Channel.prototype.mute.name}`, () => {
    beforeEach(mockVolumeNode)
    it(`can toggle mute state`, () => {
      const channel = new FakeChannel({})
      channel.mute('toggle')
      expect(channel.vol.mute).toBe(true)
      channel.mute('toggle')
      expect(channel.vol.mute).toBe(false)
    })
    it(`can change mute state`, ()=> {
      const channel = new FakeChannel({})
      channel.mute('on')
      expect(channel.vol.mute).toBe(true)
      channel.mute('off')
      expect(channel.vol.mute).toBe(false)
      channel.mute('off')
      expect(channel.vol.mute).toBe(false)
    })
  })
  describe(`${Channel.prototype.dispose.name}`, ()=> {
    const fx1 = new Tone.PingPongDelay()
    const fx2 = new Tone.Filter()
    const channel = new FakeChannel({effects: [fx1, fx2]})
    const sendChannel = new SendChannel({})
    const send = new Send(1, channel,sendChannel)
    channel.connectSend(send)
    const dispose1 = jest.spyOn(fx1, 'dispose')
    const dispose2 = jest.spyOn(fx2, 'dispose')
    const sendDispose = jest.spyOn(send, 'dispose')
    channel.dispose()
    expect(dispose1).toHaveBeenCalled()
    expect(dispose2).toHaveBeenCalled()
    expect(sendDispose).toHaveBeenCalled()
  })
})

describe(`${InstChannel.name}`, () => {
  it(`should connect all the nodes provided`, () => {
    const inst = new Tone.Synth()
    const fx1 = new Tone.Filter()
    const fx2 = new Tone.Delay()
    const instConn = jest.spyOn(inst, 'connect')
    const fx1Conn = jest.spyOn(fx1, 'connect')
    const fx2Conn = jest.spyOn(fx2, 'connect')
    new InstChannel({
      inst,
      effects: [fx1, fx2],
    })
    expect(instConn).toHaveBeenCalledWith(fx1)
    expect(fx1Conn).toHaveBeenCalledWith(fx2)
    expect(fx2Conn).toHaveBeenCalledWith(expect.any(Object)) // Volume
  })
})

describe(`${SendChannel.name}`, () => {
  it(`should connect all the nodes provided`, () => {
    const fx1 = new Tone.Filter()
    const fx2 = new Tone.Delay()
    const fx1Conn = jest.spyOn(fx1, 'connect')
    const fx2Conn = jest.spyOn(fx2, 'connect')
    new SendChannel({
      effects: [fx1, fx2],
    })
    expect(fx1Conn).toHaveBeenCalledWith(fx2)
    expect(fx2Conn).toHaveBeenCalledWith(expect.any(Object)) // Volume
  })
})

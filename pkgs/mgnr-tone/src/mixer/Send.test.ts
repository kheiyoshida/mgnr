import { Channel, Gain, PolySynth } from 'tone'
import { InstChannel, SendChannel } from './Channel'
import { Send, Sends } from './Send'
jest.mock('tone')

describe(`${Sends.name}`, () => {
  const prep = () => {
    const sends = new Sends()
    const instCh = new InstChannel({ inst: new PolySynth() })
    const sendCh = new SendChannel({ effects: [] })
    const send = new Send(1, instCh, sendCh)
    return { sends, send, instCh, sendCh }
  }
  test(`${Sends.prototype.push.name}`, () => {
    const { sends, send } = prep()
    sends.push(send)
    expect(sends.nodes).toHaveLength(1)
    expect(sends.nodes[0]).toMatchObject(send)
  })
  test(`${Sends.prototype.findSend.name}`, () => {
    const { sends, send, sendCh } = prep()
    sends.push(send)
    expect(sends.findSend(sendCh)).toMatchObject(send)
    expect(() => sends.findSend(new SendChannel({}))).toThrow()
  })
  test(`${Sends.prototype.dispose.name}`, () => {
    const { sends, send } = prep()
    sends.push(send)
    const sendDispose = jest.spyOn(send, 'dispose')
    sends.dispose()
    expect(sendDispose).toHaveBeenCalled()
  })
})

describe(`${Send.name}`, () => {
  beforeEach(() => {
    // eslint-disable-next-line no-extra-semi
    ;(Gain as any).mockImplementation(() => ({
      gain: {
        rampTo: jest.fn(),
      },
      connect: jest.fn(),
    }))
    ;(Channel as any).mockImplementation(() => ({
      mute: false,
      connect: jest.fn(),
    }))
  })
  const prep = () => {
    const instCh = new InstChannel({ inst: new PolySynth() })
    const sendCh = new SendChannel({ effects: [] })
    const send = new Send(1, instCh, sendCh)
    return { send }
  }
  test(`${Send.prototype.fade.name}`, () => {
    const { send } = prep()
    const spyRampTo = jest.spyOn(send.gain.gain, 'rampTo')
    send.fade([2, '2m', '+4m'])
    expect(spyRampTo).toHaveBeenCalledWith(2, '2m', '+4m')
  })
  test(`${Send.prototype.mute.name}`, () => {
    const { send } = prep()
    send.mute('off')
    expect(send.out.mute).toBe(false)
    send.mute('on')
    expect(send.out.mute).toBe(true)
  })
})

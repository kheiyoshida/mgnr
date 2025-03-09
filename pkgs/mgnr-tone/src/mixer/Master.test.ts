import { MasterChannel } from './Master'
jest.mock('tone')

describe(`${MasterChannel.name}`, () => {
  it(`should set all the nodes`, () => {
    const master = new MasterChannel({ limitThreshold: -2, autoLimit: false, targetRMS: -6 })
    expect(master.gainNode).toBeDefined()
    expect(master.comp).toBeDefined()
    expect(master.limiter).toBeDefined()
    expect(master.meter).toBeDefined()
    expect(master.vol).toBeDefined()
  })
})

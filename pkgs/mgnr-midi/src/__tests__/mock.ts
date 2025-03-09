
import easymidi from 'easymidi'

export const mockOutputPorts = () => {
  jest.spyOn(easymidi, 'getOutputs').mockReturnValue(['midi port 1', 'midi port 2'])
}

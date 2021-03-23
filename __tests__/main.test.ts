import * as octopus from '../src/create-release'
import * as inputs from '../src/input-parameters'

describe('release', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get()
    expect(inputParameters != undefined)
  }, 100000)
})

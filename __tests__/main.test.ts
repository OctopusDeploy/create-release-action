import * as octopus from '../src/create-release'
import * as inputs from '../src/input-parameters'

describe('create release', () => {
  it('successfully create a release', async () => {
    const inputParameters = inputs.get()
    const release = await octopus.createRelease(inputParameters)
  }, 100000)
})

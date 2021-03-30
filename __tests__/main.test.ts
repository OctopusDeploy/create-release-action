import * as inputs from '../src/input-parameters'
import * as octopus from '../src/create-release'

describe('inputs', () => {
  it('successfully get input parameters', async () => {
    const inputParameters = inputs.get()
    expect(inputParameters != undefined)
  }, 100000)
})

describe('releases', () => {
  it('successfully creates a release', async () => {
    const inputParameters = inputs.get()
    octopus.createRelease(inputParameters)
  }, 100000)
})

import * as inputs from '../src/input-parameters'
import * as octopus from '../src/create-release'

test('get input parameters', () => {
  const inputParameters = inputs.get()
  expect(inputParameters != undefined)
}, 100000)

test('create a release', () => {
  const inputParameters = inputs.get()
  return octopus.createRelease(inputParameters)
}, 100000)

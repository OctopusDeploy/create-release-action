import * as inputs from '../../src/input-parameters'

test('get input parameters', () => {
  const inputParameters = inputs.getInputParameters()
  expect(inputParameters).toBeDefined()
  expect(inputParameters.packages).toBeDefined()
  expect(inputParameters.packages).toHaveLength(2)
  expect(inputParameters.packages).toContain('foo:1.2.3-quux')
  expect(inputParameters.packages).toContain('bar:4.5.6-xyzzy')
})

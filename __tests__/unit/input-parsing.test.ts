import * as inputs from '../../src/input-parameters'

test('get input parameters', () => {
  const inputParameters = inputs.getInputParameters()
  expect(inputParameters).toBeDefined()
  expect(inputParameters.packages).toBeDefined()
  expect(inputParameters.packages).toHaveLength(2)
  expect(inputParameters.packages).toContain('foo:1.2.3-quux')
  expect(inputParameters.packages).toContain('bar:4.5.6-xyzzy')
  expect(inputParameters.gitResources).toBeDefined()
  expect(inputParameters.gitResources).toHaveLength(2)
  expect(inputParameters.gitResources).toContain('Update Argo Manifests:refs/heads/main')
  expect(inputParameters.gitResources).toContain('Run a Script:my-resource:refs/heads/dev')
  expect(inputParameters.customFields).toEqual({
    key1: 'value',
    key2: 'value:with:colons'
  })
})

import { makeInputParameters } from '../../src/input-parameters'
import { OctopusCliOutputHandler } from '../../src/octopus-cli-wrapper'
import { CaptureOutput } from '../test-helpers'

var output: CaptureOutput
var w: OctopusCliOutputHandler

beforeEach(() => {
  output = new CaptureOutput()
  w = new OctopusCliOutputHandler(output)
})

afterEach(() => {
  expect(output.warns).toEqual([]) // none of our tests here should generate warnings
})

test('standard commandline processing', () => {
  w.stdline('Octopus Deploy Command Line Tool version 123')
  w.stdline('Handshaking with Octopus Server')
  w.stdline('Authenticated as: magic user that should not be revealed')

  expect(output.infos).toEqual([
    '🐙 Using Octopus Deploy CLI 123...',
    '🤝 Handshaking with Octopus Deploy',
    '✅ Authenticated'
  ])
})

test('standard error processing also removes blank lines', () => {
  w.errline('')
  w.errline('FAILED')
  w.errline('')

  expect(output.infos).toEqual([])
  expect(output.warns).toEqual(['FAILED'])
  output.warns = [] // so the afterEach doesn't trip
})

test('picks up release number for output - auto-generated number format', () => {
  expect(w.outputReleaseNumber).toBeUndefined()

  w.stdline('Release 0.0.1 created successfully!')

  expect(w.outputReleaseNumber).toEqual('0.0.1')
  expect(output.infos).toEqual(['🎉 Release 0.0.1 created successfully!'])
})

test('picks up release number for output - specific number format', () => {
  expect(w.outputReleaseNumber).toBeUndefined()

  w.stdline('Release 3.5.2 created successfully!')

  expect(w.outputReleaseNumber).toEqual('3.5.2')
  expect(output.infos).toEqual(['🎉 Release 3.5.2 created successfully!'])
})

test('picks up release number for output - specific number format with pre tag', () => {
  expect(w.outputReleaseNumber).toBeUndefined()

  w.stdline('Release 3.5.2-prerelease.20220712133703 created successfully!')

  expect(w.outputReleaseNumber).toEqual('3.5.2-prerelease.20220712133703')
  expect(output.infos).toEqual(['🎉 Release 3.5.2-prerelease.20220712133703 created successfully!'])
})

test('thing creating release', () => {
  w.stdline('Creating release...')

  expect(output.infos).toEqual(['🐙 Creating a release in Octopus Deploy...'])
})

test('other lines just get passed through', () => {
  w.stdline('Creating release...!') // note trailing ! means the earlier thing doesn't match
  w.stdline('foo')
  w.stdline('bar')
  w.stdline('baz')

  expect(output.infos).toEqual(['Creating release...!', 'foo', 'bar', 'baz'])
})

test('filters blank lines', () => {
  w.stdline('')
  w.stdline('foo')
  w.stdline('')

  expect(output.infos).toEqual(['foo'])
})

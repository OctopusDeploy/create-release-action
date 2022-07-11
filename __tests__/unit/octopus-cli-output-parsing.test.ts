import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'

var logOutput: string[]
var w: OctopusCliWrapper

beforeEach(() => {
  logOutput = []
  w = new OctopusCliWrapper(msg => logOutput.push(msg))
})

test('standard commandline processing', () => {
  w.processLine('Octopus Deploy Command Line Tool version 123')
  w.processLine('Handshaking with Octopus Server')
  w.processLine('Authenticated as: magic user that should not be revealed')

  expect(logOutput).toEqual([
    '🐙 Using Octopus Deploy CLI 123...',
    '🤝 Handshaking with Octopus Deploy',
    '✅ Authenticated'
  ])
})

test('thing created successfully', () => {
  w.processLine('Fish created successfully!')
  w.processLine('Banana created successfully!')

  expect(logOutput).toEqual([
    '🎉 Fish created successfully!',
    '🎉 Banana created successfully!'
  ])
})

test('thing creating release', () => {
  w.processLine('Creating release...')

  expect(logOutput).toEqual(['🐙 Creating a release in Octopus Deploy...'])
})

test('other lines just get passed through', () => {
  w.processLine('Creating release...!') // note trailing ! means the earlier thing doesn't matc
  w.processLine('foo')
  w.processLine('bar')
  w.processLine('baz')

  expect(logOutput).toEqual(['Creating release...!', 'foo', 'bar', 'baz'])
})

test('filters blank lines', () => {
  w.processLine('')
  w.processLine('foo')
  w.processLine('')

  expect(logOutput).toEqual(['foo'])
})

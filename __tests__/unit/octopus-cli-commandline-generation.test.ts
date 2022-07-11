import { InputParameters } from '../../src/input-parameters'
import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'

function makeInputParameters(): InputParameters {
  return {
    project: '',
    apiKey: '',
    channel: '',
    gitRef: '',
    gitCommit: '',
    ignoreExisting: false,
    packages: [],
    packageVersion: '',
    proxy: '',
    proxyPassword: '',
    proxyUsername: '',
    releaseNotes: '',
    releaseNotesFile: '',
    releaseNumber: '',
    server: '',
    space: ''
  }
}

test('no parameters', () => {
  const w = new OctopusCliWrapper(console.info, console.warn)

  var i = makeInputParameters()
  const launchInfo = w.generateLaunchConfig({}, i)
  expect(launchInfo.args).toEqual(['create-release'])
})

test('all the parameters', () => {
  const w = new OctopusCliWrapper(console.info, console.warn)

  var i = makeInputParameters()
  i.project = 'projectZ'
  i.apiKey = 'API FOOBAR'
  i.channel = 'channelZ'
  i.gitRef = 'abcdefg'
  i.gitCommit = '0123456'
  i.ignoreExisting = true
  i.packages = ['p1']
  i.packageVersion = '5.2-pre'
  i.proxy = 'some-proxy'
  i.proxyPassword = 'some-proxy-pass'
  i.proxyUsername = 'some-proxy-user'
  i.releaseNotes = 'Release Notes: !'
  i.releaseNotesFile = '/tmp/release-notes'
  i.releaseNumber = '987'
  i.server = 'http://octopusServer'
  i.space = 'Space-61'

  const launchInfo = w.generateLaunchConfig({}, i)
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_API_KEY: 'API FOOBAR'
  })

  expect(launchInfo.args).toEqual([
    'create-release',
    '--channel=channelZ',
    '--ignoreExisting',
    '--gitRef=abcdefg',
    '--gitCommit=0123456',
    '--package=p1',
    '--packageVersion=5.2-pre',
    '--proxy=some-proxy',
    '--proxyPass=some-proxy-pass',
    '--proxyUser=some-proxy-user',
    '--releaseNotes=Release Notes: !',
    '--releaseNotesFile=/tmp/release-notes',
    '--releaseNumber=987',
    '--server=http://octopusServer',
    '--space=Space-61'
  ])
})

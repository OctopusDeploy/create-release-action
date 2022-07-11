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
  const w = new OctopusCliWrapper(makeInputParameters(), {}, console.info, console.warn)

  const launchInfo = w.generateLaunchConfig()
  expect(launchInfo.args).toEqual(['create-release'])
})

test('all the parameters', () => {
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

  const w = new OctopusCliWrapper(i, {}, console.info, console.warn)

  const launchInfo = w.generateLaunchConfig()
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_API_KEY: 'API FOOBAR',
    OCTOPUS_CLI_SERVER: 'http://octopusServer'
  })

  expect(launchInfo.args).toEqual([
    'create-release',
    '--proxy=some-proxy',
    '--proxyPass=some-proxy-pass',
    '--proxyUser=some-proxy-user',
    '--space=Space-61',
    '--channel=channelZ',
    '--ignoreExisting',
    '--gitRef=abcdefg',
    '--gitCommit=0123456',
    '--package=p1',
    '--packageVersion=5.2-pre',
    '--releaseNotes=Release Notes: !',
    '--releaseNotesFile=/tmp/release-notes',
    '--releaseNumber=987'
  ])
})

describe('pickup api key', () => {
  let infoMessages: string[]
  let warnMessages: string[]
  beforeEach(() => {
    infoMessages = []
    warnMessages = []
  })

  test('pickup api key from input', () => {
    var i = makeInputParameters()
    i.apiKey = 'API FOOBAR'

    const w = new OctopusCliWrapper(i, {}, infoMessages.push, warnMessages.push)

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FOOBAR'
    })
  })
})

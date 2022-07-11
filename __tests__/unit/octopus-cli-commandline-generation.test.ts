import { InputParameters, makeInputParameters } from '../../src/input-parameters'
import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'

test('no parameters', () => {
  const w = new OctopusCliWrapper(makeInputParameters(), {}, console.info, console.warn)

  const launchInfo = w.generateLaunchConfig()
  expect(launchInfo.args).toEqual(['create-release'])
})

test('all the parameters', () => {
  var i = makeInputParameters({
    project: 'projectZ',
    apiKey: 'API FOOBAR',
    channel: 'channelZ',
    gitRef: 'abcdefg',
    gitCommit: '0123456',
    ignoreExisting: true,
    packages: ['p1'],
    packageVersion: '5.2-pre',
    proxy: 'some-proxy',
    proxyPassword: 'some-proxy-pass',
    proxyUsername: 'some-proxy-user',
    releaseNotes: 'Release Notes: !',
    releaseNotesFile: '/tmp/release-notes',
    releaseNumber: '987',
    server: 'http://octopusServer',
    space: 'Space-61'
  })

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

  test('api key from input', () => {
    var i = makeInputParameters({ apiKey: 'API FromInput' })

    const w = new OctopusCliWrapper(
      i,
      {},
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FromInput'
    })

    expect(infoMessages).toEqual([])
    expect(warnMessages).toEqual([])
  })

  test('api key from new env var', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters(),
      { OCTOPUS_API_KEY: 'API FromEnv' },
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FromEnv'
    })

    expect(infoMessages).toEqual([])
    expect(warnMessages).toEqual([])
  })

  test('api key from deprecated env var', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters(),
      { OCTOPUS_CLI_API_KEY: 'API FromDeprecatedEnv' },
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FromDeprecatedEnv'
    })

    expect(infoMessages).toEqual([])
    expect(warnMessages).toEqual([
      'Detected Deprecated OCTOPUS_CLI_API_KEY environment variable. Prefer OCTOPUS_API_KEY'
    ])
  })

  test('input wins over env', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters({ apiKey: 'API FromInput' }),
      { OCTOPUS_API_KEY: 'API FromEnv' },
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FromInput'
    })

    expect(infoMessages).toEqual([])
    expect(warnMessages).toEqual([])
  })

  test('env wins over deprecated env', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters(),
      { OCTOPUS_API_KEY: 'API FromEnv', OCTOPUS_CLI_API_KEY: 'API FromDeprecatedEnv' },
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FromEnv'
    })

    expect(infoMessages).toEqual([])
    expect(warnMessages).toEqual([
      // still logs the warning even though we aren't using OCTOPUS_CLI_API_KEY
      'Detected Deprecated OCTOPUS_CLI_API_KEY environment variable. Prefer OCTOPUS_API_KEY'
    ])
  })

  test('input wins over both env and deprecated env', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters({ apiKey: 'API FromInput' }),
      { OCTOPUS_API_KEY: 'API FromEnv', OCTOPUS_CLI_API_KEY: 'API FromDeprecatedEnv' },
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual(['create-release'])
    expect(launchInfo.env).toEqual({
      OCTOPUS_CLI_API_KEY: 'API FromInput'
    })

    expect(infoMessages).toEqual([])
    expect(warnMessages).toEqual([
      // still logs the warning even though we aren't using OCTOPUS_CLI_API_KEY
      'Detected Deprecated OCTOPUS_CLI_API_KEY environment variable. Prefer OCTOPUS_API_KEY'
    ])
  })
})

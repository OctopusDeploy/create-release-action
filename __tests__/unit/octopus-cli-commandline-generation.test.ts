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
    '--proxyUser=some-proxy-user',
    '--proxyPass=some-proxy-pass',
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

// this is an indirect test of pickupConfigurationValueExtended
describe('pickup api key', () => {
  let infoMessages: string[]
  let warnMessages: string[]
  beforeEach(() => {
    infoMessages = []
    warnMessages = []
  })

  test('api key from input', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters({ apiKey: 'API FromInput' }),
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

// because this shares logic with api key, we don't need all the exhaustive unit test cases for it
test('pickup host', () => {
  let infoMessages: string[] = []
  let warnMessages: string[] = []

  const w = new OctopusCliWrapper(
    makeInputParameters({ server: 'server-FromInput' }),
    { OCTOPUS_CLI_SERVER: 'server-FromDeprecatedEnv', OCTOPUS_HOST: 'server-FromEnv' },
    m => infoMessages.push(m),
    m => warnMessages.push(m)
  )

  const launchInfo = w.generateLaunchConfig()
  expect(launchInfo.args).toEqual(['create-release'])
  expect(launchInfo.env).toEqual({
    OCTOPUS_CLI_SERVER: 'server-FromInput'
  })

  expect(infoMessages).toEqual([])
  expect(warnMessages).toEqual(['Detected Deprecated OCTOPUS_CLI_SERVER environment variable. Prefer OCTOPUS_HOST'])
})

describe('pickup proxy settings', () => {
  // we can test all 3 proxy settings in one go because there's not much danger of this missing a bug here
  let messages: string[] = []

  test('pickup from input', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters({
        proxy: 'proxy-FromInput',
        proxyUsername: 'proxyUser-FromInput',
        proxyPassword: 'proxyPass-FromInput'
      }),
      {},
      m => messages.push(m),
      m => messages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual([
      'create-release',
      '--proxy=proxy-FromInput',
      '--proxyUser=proxyUser-FromInput',
      '--proxyPass=proxyPass-FromInput'
    ])
    expect(launchInfo.env).toEqual({})

    expect(messages).toEqual([]) // no messages so we don't need to disambiguate types
  })

  test('pickup from env', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters(),
      {
        OCTOPUS_PROXY: 'proxy-FromEnv',
        OCTOPUS_PROXY_USERNAME: 'proxyUser-FromEnv',
        OCTOPUS_PROXY_PASSWORD: 'proxyPass-FromEnv'
      },
      m => messages.push(m),
      m => messages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual([
      'create-release',
      '--proxy=proxy-FromEnv',
      '--proxyUser=proxyUser-FromEnv',
      '--proxyPass=proxyPass-FromEnv'
    ])
    expect(launchInfo.env).toEqual({})

    expect(messages).toEqual([]) // no messages so we don't need to disambiguate types
  })

  test('input wins over env', () => {
    const w = new OctopusCliWrapper(
      makeInputParameters({
        proxy: 'proxy-FromInput',
        proxyUsername: 'proxyUser-FromInput',
        proxyPassword: 'proxyPass-FromInput'
      }),
      {
        OCTOPUS_PROXY: 'proxy-FromEnv',
        OCTOPUS_PROXY_USERNAME: 'proxyUser-FromEnv',
        OCTOPUS_PROXY_PASSWORD: 'proxyPass-FromEnv'
      },
      m => messages.push(m),
      m => messages.push(m)
    )

    const launchInfo = w.generateLaunchConfig()
    expect(launchInfo.args).toEqual([
      'create-release',
      '--proxy=proxy-FromInput',
      '--proxyUser=proxyUser-FromInput',
      '--proxyPass=proxyPass-FromInput'
    ])
    expect(launchInfo.env).toEqual({})

    expect(messages).toEqual([]) // no messages so we don't need to disambiguate types
  })
})

// because this shares logic with proxy, we don't need all the exhaustive unit test cases for it
test('pickup space', () => {
  let messages: string[] = []

  const w = new OctopusCliWrapper(
    makeInputParameters({ space: 'space-FromInput' }),
    { OCTOPUS_SPACE: 'space-FromEnv' },
    m => messages.push(m),
    m => messages.push(m)
  )

  const launchInfo = w.generateLaunchConfig()
  expect(launchInfo.args).toEqual(['create-release', '--space=space-FromInput'])
  expect(launchInfo.env).toEqual({})

  expect(messages).toEqual([])
})

// other options such as releaseNotes are simple string values with no environment variable behaviour.
// they are already covered by 'test all the parameters' so no need for specific tests for them

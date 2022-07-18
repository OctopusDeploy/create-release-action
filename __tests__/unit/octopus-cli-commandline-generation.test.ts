import { makeInputParameters } from '../../src/input-parameters'
import { generateLaunchConfig } from '../../src/octopus-cli-wrapper'

test('no parameters', () => {
  const launchInfo = generateLaunchConfig({ parameters: makeInputParameters(), env: {} }, console)
  expect(launchInfo.args).toEqual(['create-release'])
})

test('all the parameters', () => {
  var i = makeInputParameters({
    project: 'projectQ',
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

  const launchInfo = generateLaunchConfig({ parameters: i, env: {} }, console)
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
    '--project=projectQ',
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

test('all the parameters where env has the values', () => {
  const i = makeInputParameters({
    project: 'projectQ',
    channel: 'channelZ',
    gitRef: 'abcdefg',
    gitCommit: '0123456',
    ignoreExisting: true,
    packages: ['p1'],
    packageVersion: '5.2-pre',
    releaseNotes: 'Release Notes: !',
    releaseNotesFile: '/tmp/release-notes',
    releaseNumber: '987'
  })

  const env = {
    OCTOPUS_API_KEY: 'API FOOBAR',
    OCTOPUS_HOST: 'http://octopusServer',
    OCTOPUS_SPACE: 'Space-61',
    OCTOPUS_PROXY: 'some-proxy',
    OCTOPUS_PROXY_USERNAME: 'some-proxy-user',
    OCTOPUS_PROXY_PASSWORD: 'some-proxy-pass'
  }

  const launchInfo = generateLaunchConfig({ parameters: i, env: env }, console)
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
    '--project=projectQ',
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

import { createRelease } from '../../src/create-release'
import { InputParameters } from '../../src/input-parameters'
import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'

// NOTE: These tests assume Octopus is running and connectable.
// In the build pipeline they are run as part of a build.yml file which populates
// OCTOPUS_TEST_URL and OCTOPUS_TEST_APIKEY environment variables pointing to docker
// containers that are also running. AND it assumes that 'octo' is in your PATH
//
// If you want to run these locally outside the build pipeline, you need to launch
// octopus yourself, and set OCTOPUS_TEST_URL and OCTOPUS_TEST_APIKEY appropriately,
// and put octo in your path somewhere.
// Useful hint for Powershell:
//    $env:PATH += ";C:\Dev\OctopusCLI\source\Octo\bin\Debug\net6.0"

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

test('can create a release', async () => {
  const w = new OctopusCliWrapper(console.info, console.warn)
  const env: { [key: string]: string } = {}
  const inputParameters = makeInputParameters()
  const result = await createRelease(w, env, inputParameters)
})

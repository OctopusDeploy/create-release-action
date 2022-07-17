import { makeInputParameters } from '../../src/input-parameters'
import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'
// we use the Octopus API client to setup and teardown integration test data, it doesn't form part of create-release-action at this point
import { PackageRequirement, RunCondition, StartTrigger } from '@octopusdeploy/message-contracts'
import { Client, ClientConfiguration, Repository } from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { CleanupHelper } from './cleanup-helper'
import { RunConditionForAction } from '@octopusdeploy/message-contracts/dist/runConditionForAction'
import { setOutput } from '@actions/core'
import { platform } from 'os'

// NOTE: These tests assume Octopus is running and connectable.
// In the build pipeline they are run as part of a build.yml file which populates
// OCTOPUS_TEST_URL and OCTOPUS_TEST_APIKEY environment variables pointing to docker
// containers that are also running. AND it assumes that 'octo' is in your PATH
//
// If you want to run these locally outside the build pipeline, you need to launch
// octopus yourself, and set OCTOPUS_TEST_CLI_PATH, OCTOPUS_TEST_URL and OCTOPUS_TEST_APIKEY appropriately,
// and put octo in your path somewhere.
// all resources created by this script have a GUID in
// their name so we they don't clash with prior test runs

const octoExecutable = process.env.OCTOPUS_TEST_CLI_PATH || 'octo' // if 'octo' isn't in your system path, you can override it for tests here

const apiClientConfig: ClientConfiguration = {
  apiKey: process.env.OCTOPUS_TEST_APIKEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  apiUri: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

// experimental. Should probably be a custom jest matcher
function expectMatchAll(actual: string[], expected: (string | RegExp)[]) {
  expect(actual.length).toEqual(expected.length)
  for (let i = 0; i < actual.length; i++) {
    const a = actual[i]
    const e = expected[i]
    if (e instanceof RegExp) {
      expect(a).toMatch(e)
    } else {
      expect(a).toEqual(e)
    }
  }
}

describe('integration tests', () => {
  const runId = randomBytes(16).toString('hex')
  const globalCleanup = new CleanupHelper()

  const localProjectName = `project${runId}`
  const standardInputParameters = makeInputParameters({
    project: localProjectName,
    apiKey: apiClientConfig.apiKey,
    server: apiClientConfig.apiUri
  })

  let apiClient: Client
  beforeAll(async () => {
    apiClient = await Client.create(apiClientConfig)

    const repository = new Repository(apiClient)

    // pre-reqs: We need a project, which needs to have a deployment process

    const lifeCycle = (await repository.lifecycles.all())[0]
    if (!lifeCycle) throw new Error("Can't find first lifecycle")

    const projectGroup = (await repository.projectGroups.all())[0]
    if (!projectGroup) throw new Error("Can't find first projectGroup")

    const project = await repository.projects.create({
      Name: localProjectName,
      LifecycleId: lifeCycle.Id,
      ProjectGroupId: projectGroup.Id
    })
    globalCleanup.add(() => repository.projects.del(project))

    const deploymentProcess = await repository.deploymentProcesses.get(project.DeploymentProcessId, undefined)
    deploymentProcess.Steps = [
      {
        Condition: RunCondition.Success,
        Links: {},
        PackageRequirement: PackageRequirement.LetOctopusDecide,
        StartTrigger: StartTrigger.StartAfterPrevious,
        Id: '',
        Name: `step1-${runId}`,
        Properties: { 'Octopus.Action.TargetRoles': 'deploy' },
        Actions: [
          {
            Id: '',
            Name: 'Run a Script',
            ActionType: 'Octopus.Script',
            Notes: null,
            IsDisabled: false,
            CanBeUsedForProjectVersioning: false,
            IsRequired: false,
            WorkerPoolId: null,
            Container: {
              Image: null,
              FeedId: null
            },
            WorkerPoolVariable: '',
            Environments: [],
            ExcludedEnvironments: [],
            Channels: [],
            TenantTags: [],
            Packages: [],
            Condition: RunConditionForAction.Success,
            Properties: {
              'Octopus.Action.RunOnServer': 'false',
              'Octopus.Action.Script.ScriptSource': 'Inline',
              'Octopus.Action.Script.Syntax': 'Bash',
              'Octopus.Action.Script.ScriptBody': "echo 'hello'"
            },
            Links: {}
          }
        ]
      }
    ]

    await repository.deploymentProcesses.saveToProject(project, deploymentProcess)
  })

  afterAll(() => {
    if (process.env.GITHUB_ACTIONS) {
      // Sneaky: if we are running inside github actions, we *do not* cleanup the octopus server project data.
      // rather, we leave it lying around and setOutput the random project name so the GHA self-test can use it
      setOutput('gha_selftest_project_name', localProjectName)
    } else {
      globalCleanup.cleanup()
    }
  })

  test('can create a release', async () => {
    const messages: string[] = []

    const w = new OctopusCliWrapper(
      standardInputParameters,
      {},
      m => messages.push(m),
      m => messages.push(m)
    )
    const result = await w.createRelease(octoExecutable)

    // The first release in the project, so it should always have 0.0.1
    expect(result).toEqual('0.0.1')

    expectMatchAll(messages, [
      /Octopus CLI, version .*/,
      /Detected automation environment/, // Locally this detects "NoneOrUnknown", in GHA it detects "GitHubActions"
      'Space name unspecified, process will run in the default space context',
      '🤝 Handshaking with Octopus Deploy',
      /Handshake successful. Octopus version: .*/,
      '✅ Authenticated',
      'Found environments: ',
      'This Octopus Server supports channels',
      new RegExp(`Found project: ${localProjectName} .*`),
      'Automatically selecting the best channel for this release...',
      "Building a release plan for Channel 'Default'...",
      'Finding deployment process...',
      'Finding release template...',
      "Selected the release plan for Channel 'Default' - it is a perfect match",
      'Using version number from release template: 0.0.1',
      `Release plan for ${localProjectName} 0.0.1`,
      "Channel: 'Default' (this is the default channel)",
      '🐙 Creating a release in Octopus Deploy...',
      '🎉 Release 0.0.1 created successfully!'
    ])
  })

  test('fails with error if CLI executable not found', async () => {
    const messages: string[] = []

    const w = new OctopusCliWrapper(
      standardInputParameters,
      {},
      m => messages.push(m),
      m => messages.push(m)
    )

    await expect(() => w.createRelease('not-octo')).rejects.toThrow(
      'Octopus CLI executable missing. Please ensure you have added the `OctopusDeploy/install-octopus-cli-action@v1` step to your GitHub actions script before this.'
    )

    expect(messages).toEqual([])
  })

  test('fails picks up stderr from executable as well as return codes', async () => {
    const infoMessages: string[] = []
    const warnMessages: string[] = []

    const w = new OctopusCliWrapper(
      standardInputParameters,
      {},
      m => infoMessages.push(m),
      m => warnMessages.push(m)
    )

    const isWindows = platform().includes('win')

    const failingExecutable = isWindows
      ? `${__dirname}\\erroring_executable.cmd`
      : `${__dirname}/erroring_executable.sh`

    await expect(() => w.createRelease(failingExecutable)).rejects.toThrow(
      `The process '${failingExecutable}' failed with exit code 4294967295` // 4294967295 is -1
    )

    expect(infoMessages).toEqual(['An informational Message'])
    expect(warnMessages).toEqual(['An error message ']) // trailing space is deliberate because of windows bat file
  })

  test('fails with error if CLI returns an error code', async () => {
    const infos: string[] = []
    const warnings: string[] = []

    const w = new OctopusCliWrapper(
      makeInputParameters({
        // missing required 'project'
        apiKey: apiClientConfig.apiKey,
        server: apiClientConfig.apiUri
      }),
      {},
      m => infos.push(m),
      m => warnings.push(m)
    )

    await expect(() => w.createRelease(octoExecutable)).rejects.toThrow(
      `The process '${octoExecutable}' failed with exit code 4294967295`
    )

    expect(warnings).toEqual([])
    expectMatchAll(infos, [
      /Octopus CLI, version .*/,
      /Detected automation environment/,
      'Space name unspecified, process will run in the default space context',
      '🤝 Handshaking with Octopus Deploy',
      /Handshake successful. Octopus version: .*/,
      '✅ Authenticated',
      'Please specify a project name or ID using the parameter: --project=XYZ',
      'Exit code: -1'
    ])
  })

  test('fails with error if CLI returns an error code (bad auth)', async () => {
    const infos: string[] = []
    const warnings: string[] = []

    const w = new OctopusCliWrapper(
      makeInputParameters({
        project: localProjectName,
        apiKey: apiClientConfig.apiKey + 'ZZZ',
        server: apiClientConfig.apiUri
      }),
      {},
      m => infos.push(m),
      m => warnings.push(m)
    )

    await expect(() => w.createRelease(octoExecutable)).rejects.toThrow(
      `The process '${octoExecutable}' failed with exit code 4294967291`
    )

    expect(warnings).toEqual([])
    expectMatchAll(infos, [
      /Octopus CLI, version .*/,
      /Detected automation environment/,
      /The API key you provided was not valid. Please double-check your API key and try again. For instructions on finding your API key, please visit:/, // partial match because the URL might be oc.to or g.octopushq.com depending on how old the CLI is
      'Exit code: -5'
    ])
  })
})

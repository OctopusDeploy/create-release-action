import { makeInputParameters } from '../../src/input-parameters'
import { OctopusCliWrapper } from '../../src/octopus-cli-wrapper'
// we use the Octopus API client to setup and teardown integration test data, it doesn't form part of create-release-action at this point
import { PackageRequirement, RunCondition, StartTrigger } from '@octopusdeploy/message-contracts'
import { Client, ClientConfiguration, Repository } from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { CleanupHelper } from './cleanup-helper.test'
import { RunConditionForAction } from '@octopusdeploy/message-contracts/dist/runConditionForAction'

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
  apiKey: process.env.OCTOPUS_TEST_APIKEY || 'API-45R1Y10C3FRTS8RFQCWCW16DUE5IU3',
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

  let apiClient: Client
  beforeAll(async () => {
    apiClient = await Client.create(apiClientConfig)

    const systemRepo = new Repository(apiClient)

    // const teamRepo = new TeamRepository(client)
    // const teams = await teamRepo.all()
    // const team = teams.length > 0 ? teams[0] : undefined
    // if (!team) {
    //   throw new Error("Can't find first team")
    // }

    // const spaceRepo = new SpaceRepository(client)
    // const space = await spaceRepo.create({ Name: `test-${id}`, SpaceManagersTeams: [team.Id] })

    // console.log(`created space test-${id}`)

    // pre-reqs: We need a project, which needs to have a deployment process

    const lifeCycles = await systemRepo.lifecycles.all()
    const lifeCycle = lifeCycles.length > 0 ? lifeCycles[0] : undefined
    if (!lifeCycle) throw new Error("Can't find first lifecycle")

    const projectGroups = await systemRepo.projectGroups.all()
    const projectGroup = projectGroups.length > 0 ? projectGroups[0] : undefined
    if (!projectGroup) throw new Error("Can't find first projectGroup")

    const project = await systemRepo.projects.create({
      Name: localProjectName,
      LifecycleId: lifeCycle.Id,
      ProjectGroupId: projectGroup.Id
    })

    const deploymentProcess = await systemRepo.deploymentProcesses.get(project.DeploymentProcessId, undefined)

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

    await systemRepo.deploymentProcesses.saveToProject(project, deploymentProcess)

    globalCleanup.add(() => systemRepo.projects.del(project))
  })

  afterAll(() => globalCleanup.cleanup())

  test('can create a release', async () => {
    const messages: string[] = []

    const w = new OctopusCliWrapper(
      makeInputParameters({
        project: localProjectName,
        apiKey: apiClientConfig.apiKey,
        server: apiClientConfig.apiUri
      }),
      {},
      m => messages.push(m),
      m => messages.push(m)
    )
    const result = await w.createRelease(octoExecutable)

    // The first release in the project, so it should always have 0.0.1
    expect(result).toEqual('0.0.1')

    expectMatchAll(messages, [
      /Octopus CLI, version .*/,
      'Detected automation environment: "NoneOrUnknown"',
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
})

import { createReleaseFromInputs } from '../../src/api-wrapper'
// we use the Octopus API client to setup and teardown integration test data, it doesn't form part of create-release-action at this point
import {
  Client,
  ClientConfiguration,
  DeploymentProcessRepository,
  LifecycleRepository,
  Logger,
  PackageRequirement,
  Project,
  ProjectGroupRepository,
  ProjectRepository,
  RunCondition,
  RunConditionForAction,
  StartTrigger
} from '@octopusdeploy/api-client'
import { randomBytes } from 'crypto'
import { CleanupHelper } from './cleanup-helper'
import { setOutput } from '@actions/core'
import { CaptureOutput } from '../test-helpers'
import { InputParameters } from '../../src/input-parameters'

// NOTE: These tests assume Octopus is running and connectable.
// In the build pipeline they are run as part of a build.yml file which populates
// OCTOPUS_TEST_URL and OCTOPUS_TEST_API_KEY environment variables pointing to docker
// containers that are also running. AND it assumes that 'octo' is in your PATH
//
// If you want to run these locally outside the build pipeline, you need to launch
// octopus yourself, and set OCTOPUS_TEST_CLI_PATH, OCTOPUS_TEST_URL and OCTOPUS_TEST_API_KEY appropriately,
// and put octo in your path somewhere.
// all resources created by this script have a GUID in
// their name so we they don't clash with prior test runs

const apiClientConfig: ClientConfiguration = {
  userAgentApp: 'test',
  apiKey: process.env.OCTOPUS_TEST_API_KEY || 'API-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  instanceURL: process.env.OCTOPUS_TEST_URL || 'http://localhost:8050'
}

describe('integration tests', () => {
  const runId = randomBytes(16).toString('hex')

  const globalCleanup = new CleanupHelper()

  const localProjectName = `project${runId}`
  const standardInputParameters: InputParameters = {
    server: apiClientConfig.instanceURL,
    apiKey: apiClientConfig.apiKey,
    space: 'Default',
    project: localProjectName,
    ignoreExisting: false
  }

  let apiClient: Client
  let project: Project

  beforeAll(async () => {
    apiClient = await Client.create(apiClientConfig)

    // pre-reqs: We need a project, which needs to have a deployment process

    const lifecycleRepository = new LifecycleRepository(apiClient, standardInputParameters.space)
    const lifecycle = (await lifecycleRepository.list({ take: 1 })).Items[0]
    if (!lifecycle) throw new Error("Can't find first lifecycle")

    const projectGroup = (await new ProjectGroupRepository(apiClient, standardInputParameters.space).list({ take: 1 }))
      .Items[0]
    if (!projectGroup) throw new Error("Can't find first projectGroup")

    const projectRepository = new ProjectRepository(apiClient, standardInputParameters.space)
    project = await projectRepository.create({
      Name: localProjectName,
      LifecycleId: lifecycle.Id,
      ProjectGroupId: projectGroup.Id
    })
    globalCleanup.add(async () => await projectRepository.del(project))

    const deploymentProcessRepository = new DeploymentProcessRepository(apiClient, standardInputParameters.space)
    const deploymentProcess = await deploymentProcessRepository.get(project)
    deploymentProcess.Steps = [
      {
        Condition: RunCondition.Success,
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
            }
          }
        ]
      }
    ]

    await deploymentProcessRepository.update(project, deploymentProcess)
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
    const output = new CaptureOutput()

    const logger: Logger = {
      debug: message => output.debug(message),
      info: message => output.info(message),
      warn: message => output.warn(message),
      error: (message, err) => {
        if (err !== undefined) {
          output.error(err.message)
        } else {
          output.error(message)
        }
      }
    }

    const config: ClientConfiguration = {
      userAgentApp: 'test',
      instanceURL: apiClientConfig.instanceURL,
      apiKey: apiClientConfig.apiKey,
      logging: logger
    }

    const client = await Client.create(config)

    const result = await createReleaseFromInputs(client, standardInputParameters)

    // The first release in the project, so it should always have 0.0.1
    expect(result).toEqual('0.0.1')

    expect(output.getAllMessages()).toContain('[INFO] 🐙 Creating a release in Octopus Deploy...')
    expect(output.getAllMessages()).toContain('[INFO] 🎉 Release 0.0.1 created successfully!')
  })
})

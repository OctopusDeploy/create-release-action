import { getInputParameters } from './input-parameters'
import { info, warning, setFailed, setOutput } from '@actions/core'
import { writeFileSync } from 'fs'
import { Client, ClientConfiguration, createRelease, CreateReleaseCommandV1 } from '@octopusdeploy/api-client'

const EnvironmentVariables = {
  ApiKey: 'OCTOPUS_API_KEY',
  URI: 'OCTOPUS_URI',
  Space: 'OCTOPUS_SPACE'
} as const

// GitHub actions entrypoint
async function run(): Promise<void> {
  try {
    const parameters = getInputParameters()

    const apiKey = parameters.apiKey || process.env[EnvironmentVariables.ApiKey] || ''
    const instanceUri = parameters.server || process.env[EnvironmentVariables.URI] || ''
    const space = parameters.space || process.env[EnvironmentVariables.Space] || ''

    const config: ClientConfiguration = {
      instanceUri: instanceUri,
      apiKey: apiKey
    }

    const command: CreateReleaseCommandV1 = {
      spaceName: space,
      projectName: parameters.project,
      channelName: parameters.channel,
      releaseVersion: parameters.releaseNumber,
      packageVersion: parameters.packageVersion,
      packages: parameters.packages,
      gitRef: parameters.gitRef,
      gitCommit: parameters.gitCommit,
      releaseNotes: parameters.releaseNotes,
      ignoreIfAlreadyExists: parameters.ignoreExisting,
      ignoreChannelRules: false
    }

    const client = await Client.create(config)

    const allocatedReleaseNumber = await createRelease(client, command)

    if (allocatedReleaseNumber) {
      setOutput('release_number', allocatedReleaseNumber.releaseVersion)
    }

    const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY
    if (stepSummaryFile && allocatedReleaseNumber) {
      writeFileSync(
        stepSummaryFile,
        `🐙 Octopus Deploy Created Release **${allocatedReleaseNumber}** in Project **${parameters.project}**.`
      )
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()

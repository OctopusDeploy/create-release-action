import { getInputParameters, InputParameters } from './input-parameters'
import { debug, info, warning, error, setFailed, setOutput } from '@actions/core'
import { writeFileSync } from 'fs'
import { Client, ClientConfiguration, createRelease, CreateReleaseCommandV1, Logger } from '@octopusdeploy/api-client'

const EnvironmentVariables = {
  ApiKey: 'OCTOPUS_API_KEY',
  URL: 'OCTOPUS_URL',
  Space: 'OCTOPUS_SPACE'
} as const

// GitHub actions entrypoint
async function run(): Promise<void> {
  try {
    const logger: Logger = {
      debug: message => debug(message),
      info: message => info(message),
      warn: message => warning(message),
      error: (message, err) => {
        if (err !== undefined) {
          error(err.message)
        } else {
          error(message)
        }
      }
    }

    const parameters = getInputParameters()

    const allocatedReleaseNumber = await createReleaseFromInputs(logger, parameters)

    if (allocatedReleaseNumber) {
      setOutput('release_number', allocatedReleaseNumber)
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

export async function createReleaseFromInputs(logger: Logger, parameters: InputParameters): Promise<string> {
  const apiKey = parameters.apiKey || process.env[EnvironmentVariables.ApiKey] || ''
  const instanceURL = parameters.server || process.env[EnvironmentVariables.URL] || ''
  const space = parameters.space || process.env[EnvironmentVariables.Space] || ''

  const config: ClientConfiguration = {
    instanceURL,
    apiKey,
    logging: logger
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

  return allocatedReleaseNumber.releaseVersion
}

run()

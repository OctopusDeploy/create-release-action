import { getInputParameters } from './input-parameters'
import { debug, info, warning, error, setFailed, setOutput, isDebug } from '@actions/core'
import { writeFileSync } from 'fs'
import { Client, ClientConfiguration, Logger } from '@octopusdeploy/api-client'
import { createReleaseFromInputs } from './api-wrapper'

// GitHub actions entrypoint
;(async (): Promise<void> => {
  try {
    const logger: Logger = {
      debug: message => {
        if (isDebug()) {
          debug(message)
        }
      },
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

    const config: ClientConfiguration = {
      userAgentApp: 'GitHubActions (release;create;v3)',
      instanceURL: parameters.server,
      apiKey: parameters.apiKey,
      accessToken: parameters.accessToken,
      logging: logger
    }

    const client = await Client.create(config)

    const allocatedReleaseNumber = await createReleaseFromInputs(client, parameters)

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
    } else {
      setFailed(`Unknown error: ${e}`)
    }
  }
})()

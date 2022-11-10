import { getInputParameters } from './input-parameters'
import { debug, info, warning, error, setFailed, setOutput } from '@actions/core'
import { writeFileSync } from 'fs'
import { Client, ClientConfiguration, Logger } from '@octopusdeploy/api-client'
import { createReleaseFromInputs } from './api-wrapper'

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

    const config: ClientConfiguration = {
      instanceURL: parameters.server,
      apiKey: parameters.apiKey,
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
    }
  }
}

run()

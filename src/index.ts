import { getInputParameters } from './input-parameters'
import { info, warning, setFailed, setOutput } from '@actions/core'
import { CliInputs, createRelease } from './octopus-cli-wrapper'
import { writeFileSync } from 'fs'
import { CliOutput } from './cli-util'

// GitHub actions entrypoint
async function run(): Promise<void> {
  try {
    const inputs: CliInputs = { parameters: getInputParameters(), env: process.env }
    const outputs: CliOutput = { info: s => info(s), warn: s => warning(s) }

    const allocatedReleaseNumber = await createRelease(inputs, outputs, 'octo')

    if (allocatedReleaseNumber) {
      setOutput('release_number', allocatedReleaseNumber)
    }

    const stepSummaryFile = process.env.GITHUB_STEP_SUMMARY
    if (stepSummaryFile && allocatedReleaseNumber) {
      writeFileSync(
        stepSummaryFile,
        `🐙 Octopus Deploy Created Release **${allocatedReleaseNumber}** in Project **${inputs.parameters.project}**.`
      )
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()

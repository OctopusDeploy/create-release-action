import { getInputParameters } from './input-parameters'
import { info, warning, setFailed, setOutput } from '@actions/core'
import { CliInputs, generateLaunchConfig, OctopusCliOutputHandler } from './octopus-cli-wrapper'
import { writeFileSync } from 'fs'
import { exec, ExecOptions } from '@actions/exec'
import { CliOutput } from './cli-util'

// This invokes the CLI to do the work.
// Returns the release number assigned by the octopus server
// This shells out to 'octo' and expects to be running in GHA, so you can't unit test it; integration tests only.
export async function createRelease(
  inputs: CliInputs,
  output: CliOutput,
  octoExecutable: string
): Promise<string | undefined> {
  const outputHandler = new OctopusCliOutputHandler(output)

  const cliLaunchConfiguration = generateLaunchConfig(inputs, output)

  // the launch config will only have the specific few env vars that the script wants to set.
  // Need to merge with the rest of the environment variables, otherwise we will pass a
  // stripped environment through to the CLI and it won't have meaningful things like HOME and PATH
  const envCopy = { ...(process.env as { [key: string]: string }) }
  Object.assign(envCopy, cliLaunchConfiguration.env)

  const options: ExecOptions = {
    listeners: {
      stdline: input => outputHandler.stdline(input),
      errline: input => outputHandler.errline(input)
    },
    env: envCopy,
    silent: true
  }

  try {
    await exec(octoExecutable, cliLaunchConfiguration.args, options)
    return outputHandler.outputReleaseNumber
  } catch (e: unknown) {
    if (e instanceof Error) {
      // catch some particular messages and rethrow more convenient ones
      if (e.message.includes('Unable to locate executable file')) {
        throw new Error(
          'Octopus CLI executable missing. Please ensure you have added the `OctopusDeploy/install-octopus-cli-action@v1` step to your GitHub actions script before this.'
        )
      }
    }
    // rethrow, so our Promise is rejected. The GHA shim in index.ts will catch this and call setFailed
    throw e
  }
}

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

if (process.env.GITHUB_ACTIONS) {
  run()
}

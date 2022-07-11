import { info, setFailed, warning } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { InputParameters } from './input-parameters'
import { OctopusCliWrapper, generateCommandLine } from './octopus-cli-wrapper'

export async function createRelease(
  parameters: InputParameters
): Promise<void> {
  const octopusCliWrapper = new OctopusCliWrapper(msg => info(msg))

  info('🔣 Parsing inputs...')
  const args = generateCommandLine(parameters)

  const options: ExecOptions = {
    listeners: {
      stdline: octopusCliWrapper.processLine
    },
    silent: true
  }

  try {
    await exec('octo', args, options)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

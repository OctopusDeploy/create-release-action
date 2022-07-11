import { info, setFailed, warning } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { InputParameters } from './input-parameters'
import { OctopusCliWrapper } from './octopus-cli-wrapper'

export async function createRelease(cliWrapper: OctopusCliWrapper, parameters: InputParameters): Promise<void> {
  info('🔣 Parsing inputs...')
  const cliLaunchConfiguration = cliWrapper.generateLaunchConfig(parameters)

  const options: ExecOptions = {
    listeners: {
      stdline: cliWrapper.stdline
    },
    env: cliLaunchConfiguration.env,
    silent: true
  }

  try {
    await exec('octo', cliLaunchConfiguration.args, options)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

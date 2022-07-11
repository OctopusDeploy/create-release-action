import { createRelease } from './create-release'
import { get } from './input-parameters'
import { info, warning, setFailed } from '@actions/core'
import { OctopusCliWrapper } from './octopus-cli-wrapper'

async function run(): Promise<void> {
  try {
    const wrapper = new OctopusCliWrapper(
      msg => info(msg),
      msg => warning(msg)
    )
    const env = process.env
    const inputParameters = get()
    await createRelease(wrapper, env, inputParameters)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()

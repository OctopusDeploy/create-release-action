import { getInputParameters } from './input-parameters'
import { info, warning, setFailed } from '@actions/core'
import { OctopusCliWrapper } from './octopus-cli-wrapper'

async function run(): Promise<void> {
  try {
    const wrapper = new OctopusCliWrapper(
      getInputParameters(),
      process.env,
      msg => info(msg),
      msg => warning(msg)
    )
    await wrapper.createRelease()
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()

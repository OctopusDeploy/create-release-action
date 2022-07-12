import { getInputParameters } from './input-parameters'
import { info, warning, setFailed, setOutput } from '@actions/core'
import { OctopusCliWrapper } from './octopus-cli-wrapper'

async function run(): Promise<void> {
  try {
    const wrapper = new OctopusCliWrapper(
      getInputParameters(),
      process.env,
      msg => info(msg),
      msg => warning(msg)
    )
    const allocatedReleaseNumber = await wrapper.createRelease()

    if (allocatedReleaseNumber) {
      setOutput('release_number', allocatedReleaseNumber)
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()

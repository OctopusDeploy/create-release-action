import * as core from '@actions/core'
import * as octopus from './create-release'
import * as inputs from './input-parameters'

async function run(): Promise<void> {
  try {
    const inputParameters = inputs.get()
    await octopus.createRelease(inputParameters)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

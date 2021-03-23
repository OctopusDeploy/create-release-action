import * as core from '@actions/core'
import * as octopus from '../src/create-release'
import * as inputs from '../src/input-parameters'

async function run(): Promise<void> {
  try {
    const inputParameters = inputs.get()
    await octopus.createRelease(inputParameters)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

import {setFailed} from '@actions/core'
import {createRelease} from './create-release'
import {get} from './input-parameters'

async function run(): Promise<void> {
  try {
    const inputParameters = get()
    await createRelease(inputParameters)
  } catch (error) {
    setFailed(error.message)
  }
}

run()

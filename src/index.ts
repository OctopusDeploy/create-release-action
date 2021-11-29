import { createRelease } from './create-release'
import { get } from './input-parameters'
import { setFailed } from '@actions/core'

async function run(): Promise<void> {
  try {
    const inputParameters = get()
    await createRelease(inputParameters)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

run()

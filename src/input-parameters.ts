import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

export interface InputParameters {
  // Optional: A server is required, but you should use the OCTOPUS_URL env
  server: string
  // Optional: An API key is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey: string
  // Optional: You should prefer the OCTOPUS_SPACE environment variable
  space: string
  // Required
  project: string
  releaseNumber: string
  channel: string
  packageVersion: string
  packages: string[]
  gitRef: string
  gitCommit: string
  ignoreExisting: boolean

  // Optional
  releaseNotes: string
}

export function getInputParameters(): InputParameters {
  return {
    space: getInput('space'),
    server: getInput('server'),
    apiKey: getInput('api_key'),
    project: getInput('project'),
    releaseNumber: getInput('release_number'),
    channel: getInput('channel'),
    packageVersion: getInput('package_version'),
    packages: getMultilineInput('packages').map(p => p.trim()),
    gitRef: getInput('git_ref'),
    gitCommit: getInput('git_commit'),
    ignoreExisting: getBooleanInput('ignore_existing'),
    releaseNotes: getInput('release_notes')
  }
}

export function makeInputParameters(override: Partial<InputParameters> | undefined = undefined): InputParameters {
  const template = {
    server: '',
    apiKey: '',
    space: '',
    project: '',
    releaseNumber: '',
    channel: '',
    packageVersion: '',
    packages: [],
    gitRef: '',
    gitCommit: '',
    ignoreExisting: false,
    releaseNotes: ''
  }

  if (override) {
    Object.assign(template, override)
  }
  return template
}

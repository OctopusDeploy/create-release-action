import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

const EnvironmentVariables = {
  URL: 'OCTOPUS_URL',
  ApiKey: 'OCTOPUS_API_KEY',
  Space: 'OCTOPUS_SPACE'
} as const

export interface InputParameters {
  // Optional: A server is required, but you should use the OCTOPUS_URL env
  server: string
  // Optional: An API key is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey: string
  // Optional: You should prefer the OCTOPUS_SPACE environment variable
  space: string
  // Required
  project: string
  releaseNumber?: string
  channel?: string
  packageVersion?: string
  packages?: string[]
  gitRef?: string
  gitCommit?: string
  ignoreExisting: boolean

  // Optional
  releaseNotes?: string
}

export function getInputParameters(): InputParameters {
  return {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey] || '',
    space: getInput('space') || process.env[EnvironmentVariables.Space] || '',
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

import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

const EnvironmentVariables = {
  URL: 'OCTOPUS_URL',
  ApiKey: 'OCTOPUS_API_KEY',
  AccessToken: 'OCTOPUS_ACCESS_TOKEN',
  Space: 'OCTOPUS_SPACE'
} as const

export interface InputParameters {
  // Optional: A server is required, but you should use the OCTOPUS_URL env
  server: string
  // Optional: One of API key or Access token is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey?: string
  // Optional: One of API key or Access token is required, but you should use the OCTOPUS_ACCESS_TOKEN environment variable instead of this.
  accessToken?: string
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
  ignoreExisting?: boolean

  // Optional
  releaseNotes?: string
  releaseNotesFile?: string
}

export function getInputParameters(): InputParameters {
  const parameters: InputParameters = {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey],
    accessToken: getInput('access_token') || process.env[EnvironmentVariables.AccessToken],
    space: getInput('space') || process.env[EnvironmentVariables.Space] || '',
    project: getInput('project', { required: true }),
    releaseNumber: getInput('release_number') || undefined,
    channel: getInput('channel') || undefined,
    packageVersion: getInput('package_version') || undefined,
    packages: getMultilineInput('packages').map(p => p.trim()) || undefined,
    gitRef: getInput('git_ref') || undefined,
    gitCommit: getInput('git_commit') || undefined,
    ignoreExisting: getBooleanInput('ignore_existing') || undefined,
    releaseNotes: getInput('release_notes') || undefined,
    releaseNotesFile: getInput('release_notes_file') || undefined
  }

  const errors: string[] = []
  if (!parameters.server) {
    errors.push(
      "The Octopus instance URL is required, please specify explicitly through the 'server' input or set the OCTOPUS_URL environment variable."
    )
  }

  if (!parameters.apiKey && !parameters.accessToken)
    errors.push(
      "One of API Key or Access Token are required, please specify explicitly through the 'api_key'/'access_token' inputs or set the OCTOPUS_API_KEY/OCTOPUS_ACCESS_TOKEN environment variable."
    )

  if (parameters.apiKey && parameters.accessToken) errors.push('Only one of API Key or Access Token can be supplied.')

  if (!parameters.space) {
    errors.push(
      "The Octopus space name is required, please specify explicitly through the 'space' input or set the OCTOPUS_SPACE environment variable."
    )
  }

  if (parameters.releaseNotes && parameters.releaseNotesFile) {
    errors.push(
      'Please specify one or other of `release_notes` and `release_notes_files`. Specifying both is not supported.'
    )
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return parameters
}

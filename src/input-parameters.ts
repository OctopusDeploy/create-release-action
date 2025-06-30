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
  // Optional: An API key is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey?: string
  // Optional: Access token can only be obtained from the OCTOPUS_ACCESS_TOKEN environment variable.
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
  customFields?: Record<string, string>
}

const createCustomFields = (inputParamaters: string[]): Record<string, string> => {
  return inputParamaters.reduce((acc, field) => {
    const [key, value] = field.split(':').map(part => part.trim())
    if (key && value) {
      acc[key] = value
    }
    return acc
  }, {} as Record<string, string>)
}

export function getInputParameters(): InputParameters {
  const parameters: InputParameters = {
    server: getInput('server') || process.env[EnvironmentVariables.URL] || '',
    apiKey: getInput('api_key') || process.env[EnvironmentVariables.ApiKey],
    accessToken: process.env[EnvironmentVariables.AccessToken],
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
    releaseNotesFile: getInput('release_notes_file') || undefined,
    customFields: createCustomFields(getMultilineInput('custom_fields'))
  }

  const errors: string[] = []
  if (!parameters.server) {
    errors.push(
      "The Octopus instance URL is required, please specify explicitly through the 'server' input or set the OCTOPUS_URL environment variable."
    )
  }

  if (!parameters.apiKey && !parameters.accessToken) {
    errors.push(
      "The Octopus API Key is required, please specify explicitly through the 'api_key' input or set the OCTOPUS_API_KEY environment variable."
    )
  }

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

import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

export interface InputParameters {
  // Required
  project: string
  // Optional: An API key is required, but you should use the OCTOPUS_API_KEY environment variable instead of this.
  apiKey: string
  channel: string
  gitRef: string
  gitCommit: string
  ignoreExisting: boolean
  packages: string[]
  packageVersion: string

  // Optional: Prefer the OCTOPUS_PROXY environment variable
  proxy: string
  // Optional: Prefer the OCTOPUS_PROXY_PASSWORD environment variable
  proxyPassword: string
  // Optional: Prefer the OCTOPUS_PROXY_USERNAME environment variable
  proxyUsername: string

  // Optional
  releaseNotes: string
  // Optional: Overrides release_notes
  releaseNotesFile: string
  releaseNumber: string
  // Optional: A server is required, but you should use the OCTOPUS_HOST env
  server: string
  // Optional: You should prefer the OCTOPUS_SPACE environment variable
  space: string
}

export function getInputParameters(): InputParameters {
  return {
    apiKey: getInput('api_key'),
    channel: getInput('channel'),
    gitRef: getInput('git_ref'),
    gitCommit: getInput('git_commit'),
    ignoreExisting: getBooleanInput('ignore_existing'),
    packages: getMultilineInput('packages').map(p => p.trim()),
    packageVersion: getInput('package_version'),
    project: getInput('project'),
    proxy: getInput('proxy'),
    proxyPassword: getInput('proxy_password'),
    proxyUsername: getInput('proxy_username'),
    releaseNotes: getInput('release_notes'),
    releaseNotesFile: getInput('release_notes_file'),
    releaseNumber: getInput('release_number'),
    server: getInput('server'),
    space: getInput('space')
  }
}

export function makeInputParameters(override: Partial<InputParameters> | undefined = undefined): InputParameters {
  const template = {
    project: '',
    apiKey: '',
    channel: '',
    gitRef: '',
    gitCommit: '',
    ignoreExisting: false,
    packages: [],
    packageVersion: '',
    proxy: '',
    proxyPassword: '',
    proxyUsername: '',
    releaseNotes: '',
    releaseNotesFile: '',
    releaseNumber: '',
    server: '',
    space: ''
  }

  if (override) {
    Object.assign(template, override)
  }
  return template
}

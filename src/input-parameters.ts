import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

export interface InputParameters {
  apiKey: string
  cancelOnTimeout: boolean
  channel: string
  configFile: string
  debug: boolean
  defaultPackageVersion: boolean
  deployAt: string
  deployTo: string
  deploymentCheckSleepCycle: string
  deploymentTimeout: string
  excludeMachines: string
  force: boolean
  forcePackageDownload: boolean
  gitRef: string
  gitCommit: string
  guidedFailure: string
  ignoreChannelRules: boolean
  ignoreExisting: boolean
  ignoreSslErrors: boolean
  logLevel: string
  noDeployAfter: string
  noRawLog: boolean
  package: string
  packagePrerelease: string
  packages: string[]
  packageVersion: string
  packagesFolder: string
  password: string
  progress: boolean
  project: string
  proxy: string
  proxyPassword: string
  proxyUsername: string
  rawLogFile: string
  releaseNotes: string
  releaseNotesFile: string
  releaseNumber: string
  server: string
  skip: string
  space: string
  specificMachines: string
  tenant: string
  tenants: string[]
  tenantTag: string
  tenantTags: string[]
  timeout: string
  username: string
  variable: string
  variables: string[]
  waitForDeployment: boolean
  whatIf: boolean
}

export function get(): InputParameters {
  return {
    apiKey: getInput('api_key'),
    cancelOnTimeout: getBooleanInput('cancel_on_timeout'),
    channel: getInput('channel'),
    configFile: getInput('config_file'),
    debug: getBooleanInput('debug'),
    defaultPackageVersion: getBooleanInput('default_package_version'),
    deployAt: getInput('deploy_at'),
    deployTo: getInput('deploy_to'),
    deploymentCheckSleepCycle: getInput('deployment_check_sleep_cycle'),
    deploymentTimeout: getInput('deployment_timeout'),
    excludeMachines: getInput('exclude_machines'),
    force: getBooleanInput('force'),
    forcePackageDownload: getBooleanInput('force_package_download'),
    gitRef: getInput('git_ref'),
    gitCommit: getInput('git_commit'),
    guidedFailure: getInput('guided_failure'),
    ignoreChannelRules: getBooleanInput('ignore_channel_rules'),
    ignoreExisting: getBooleanInput('ignore_existing'),
    ignoreSslErrors: getBooleanInput('ignore_ssl_errors'),
    logLevel: getInput('log_level'),
    noDeployAfter: getInput('no_deploy_after'),
    noRawLog: getBooleanInput('no_raw_log'),
    package: getInput('package'),
    packages: getMultilineInput('packages').map(p => p.trim()),
    packagePrerelease: getInput('package_prerelease'),
    packageVersion: getInput('package_version'),
    packagesFolder: getInput('packages_folder'),
    password: getInput('password'),
    progress: getBooleanInput('progress'),
    project: getInput('project'),
    proxy: getInput('proxy'),
    proxyPassword: getInput('proxy_password'),
    proxyUsername: getInput('proxy_username'),
    rawLogFile: getInput('raw_log_file'),
    releaseNotes: getInput('release_notes'),
    releaseNotesFile: getInput('release_notes_file'),
    releaseNumber: getInput('release_number'),
    server: getInput('server'),
    skip: getInput('skip'),
    space: getInput('space'),
    specificMachines: getInput('specific_machines'),
    tenant: getInput('tenant'),
    tenants: getMultilineInput('tenants').map(p => p.trim()),
    tenantTag: getInput('tenant_tag'),
    tenantTags: getMultilineInput('tenant_tags').map(p => p.trim()),
    timeout: getInput('timeout'),
    username: getInput('user'),
    variable: getInput('variable'),
    variables: getMultilineInput('variables').map(p => p.trim()),
    waitForDeployment: getBooleanInput('wait_for_deployment'),
    whatIf: getBooleanInput('what_if')
  }
}

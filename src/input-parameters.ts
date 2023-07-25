import { getBooleanInput, getInput, getMultilineInput } from '@actions/core'

export interface InputParameters {

  apiKey: string
  space: string
  project: string
  releaseNumber: string
  deployTo: string
  progress: boolean
  tenantTag: string
  tenantTags: string[]
  timeout: string
  gitRef: string
  gitCommit: string
  server: string
  tenant: string
  tenants: string[]  
  // cancelOnTimeout: boolean
  // channel: string
  // configFile: string
  // debug: boolean
  // defaultPackageVersion: boolean
  // deployAt: string
  
  // deploymentCheckSleepCycle: string
  // deploymentTimeout: string
  // excludeMachines: string
  // force: boolean
  // forcePackageDownload: boolean

  // guidedFailure: string
  // ignoreChannelRules: boolean
  // ignoreExisting: boolean
  // ignoreSslErrors: boolean
  // logLevel: string
  // noDeployAfter: string
  // noRawLog: boolean
  // package: string
  // packagePrerelease: string
  // packages: string[]
  // packageVersion: string
  // packagesFolder: string
  // password: string
  
  // project: string
  // proxy: string
  // proxyPassword: string
  // proxyUsername: string
  // rawLogFile: string
  // releaseNotes: string
  // releaseNotesFile: string
  
  
  // skip: string
  
  // specificMachines: string


  // username: string
  // variable: string
  // variables: string[]
  // waitForDeployment: boolean
  // whatIf: boolean
}

export function get(): InputParameters {
  return {
    apiKey: getInput('api_key'),
    space: getInput('space'),
    project: getInput('project'),
    releaseNumber: getInput('release_number'),
    deployTo: getInput('deploy_to'),
    progress: getBooleanInput('progress'),
    server: getInput('server'),
    tenantTag: getInput('tenant_tag'),
    tenantTags: getMultilineInput('tenant_tags').map(p => p.trim()),
    tenant: getInput('tenant'),
    tenants: getMultilineInput('tenants').map(p => p.trim()),
    gitRef: getInput('git_ref'),
    gitCommit: getInput('git_commit'),
    timeout: getInput('timeout')
    // cancelOnTimeout: getBooleanInput('cancel_on_timeout'),
    // channel: getInput('channel'),
    // configFile: getInput('config_file'),
    // debug: getBooleanInput('debug'),
    // defaultPackageVersion: getBooleanInput('default_package_version'),
    // deployAt: getInput('deploy_at'),
    // deploymentCheckSleepCycle: getInput('deployment_check_sleep_cycle'),
    // deploymentTimeout: getInput('deployment_timeout'),
    // excludeMachines: getInput('exclude_machines'),
    // force: getBooleanInput('force'),
    // forcePackageDownload: getBooleanInput('force_package_download'),
    // guidedFailure: getInput('guided_failure'),
    // ignoreChannelRules: getBooleanInput('ignore_channel_rules'),
    // ignoreExisting: getBooleanInput('ignore_existing'),
    // ignoreSslErrors: getBooleanInput('ignore_ssl_errors'),
    // logLevel: getInput('log_level'),
    // noDeployAfter: getInput('no_deploy_after'),
    // noRawLog: getBooleanInput('no_raw_log'),
    // package: getInput('package'),
    // packages: getMultilineInput('packages').map(p => p.trim()),
    // packagePrerelease: getInput('package_prerelease'),
    // packageVersion: getInput('package_version'),
    // packagesFolder: getInput('packages_folder'),
    // password: getInput('password'),
    // proxy: getInput('proxy'),
    // proxyPassword: getInput('proxy_password'),
    // proxyUsername: getInput('proxy_username'),
    // rawLogFile: getInput('raw_log_file'),
    // releaseNotes: getInput('release_notes'),
    // releaseNotesFile: getInput('release_notes_file'),
    // skip: getInput('skip'),
    // specificMachines: getInput('specific_machines'),
    //  username: getInput('user'),
    // variable: getInput('variable'),
    // variables: getMultilineInput('variables').map(p => p.trim()),
    // waitForDeployment: getBooleanInput('wait_for_deployment'),
    // whatIf: getBooleanInput('what_if')
  }
}

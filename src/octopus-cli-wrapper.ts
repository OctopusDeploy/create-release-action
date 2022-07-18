import {
  CliOutput,
  CliLaunchConfiguration,
  EnvVars,
  pickupConfigurationValue,
  pickupConfigurationValueExtended
} from './cli-util'
import { InputParameters } from './input-parameters'

// Things in this file are specific to create-release-action and not shared with other actions

export interface CliInputs {
  parameters: InputParameters
  env: EnvVars
}

// Converts incoming environment and inputParameters into a set of commandline args + env vars to run the Octopus CLI
export function generateLaunchConfig(inputs: CliInputs, output: CliOutput): CliLaunchConfiguration {
  const launchArgs: string[] = ['create-release']
  const launchEnv: { [key: string]: string } = {}

  const parameters = inputs.parameters

  pickupConfigurationValueExtended(
    output,
    inputs.env,
    parameters.apiKey,
    'OCTOPUS_CLI_API_KEY',
    'OCTOPUS_API_KEY',
    value => (launchEnv['OCTOPUS_CLI_API_KEY'] = value)
  )

  pickupConfigurationValueExtended(
    output,
    inputs.env,
    parameters.server,
    'OCTOPUS_CLI_SERVER',
    'OCTOPUS_HOST',
    value => (launchEnv['OCTOPUS_CLI_SERVER'] = value)
  )

  pickupConfigurationValue(inputs.env, parameters.proxy, 'OCTOPUS_PROXY', value => launchArgs.push(`--proxy=${value}`))

  pickupConfigurationValue(inputs.env, parameters.proxyUsername, 'OCTOPUS_PROXY_USERNAME', value =>
    launchArgs.push(`--proxyUser=${value}`)
  )
  pickupConfigurationValue(inputs.env, parameters.proxyPassword, 'OCTOPUS_PROXY_PASSWORD', value =>
    launchArgs.push(`--proxyPass=${value}`)
  )

  pickupConfigurationValue(inputs.env, parameters.space, 'OCTOPUS_SPACE', value => launchArgs.push(`--space=${value}`))

  if (parameters.project.length > 0) {
    launchArgs.push(`--project=${parameters.project}`)
  }
  if (parameters.channel.length > 0) {
    launchArgs.push(`--channel=${parameters.channel}`)
  }
  if (parameters.ignoreExisting) {
    launchArgs.push(`--ignoreExisting`)
  }
  if (parameters.gitRef.length > 0) {
    launchArgs.push(`--gitRef=${parameters.gitRef}`)
  }
  if (parameters.gitCommit.length > 0) {
    launchArgs.push(`--gitCommit=${parameters.gitCommit}`)
  }
  if (parameters.packages.length > 0) {
    parameters.packages.map(p => launchArgs.push(`--package=${p}`))
  }
  if (parameters.packageVersion.length > 0) {
    launchArgs.push(`--packageVersion=${parameters.packageVersion}`)
  }
  if (parameters.releaseNotes.length > 0) {
    launchArgs.push(`--releaseNotes=${parameters.releaseNotes}`)
  }
  if (parameters.releaseNotesFile.length > 0) {
    launchArgs.push(`--releaseNotesFile=${parameters.releaseNotesFile}`)
  }
  if (parameters.releaseNumber.length > 0) {
    launchArgs.push(`--releaseNumber=${parameters.releaseNumber}`)
  }

  return { args: launchArgs, env: launchEnv }
}

// consumes stdline and errline from the child process
// and transforms/buffers output as needed
export class OctopusCliOutputHandler {
  readonly output: CliOutput

  // if we parse CLI output and see a release number, it will get stashed here for later retrival
  outputReleaseNumber: string | undefined

  constructor(output: CliOutput) {
    this.output = output
  }

  // public: attach this to the process errline
  errline(line: string): void {
    if (line.length === 0) {
      return
    }
    this.output.warn(line)
  }

  // public: attach this to the process stdline
  stdline(line: string): void {
    if (line.length === 0) {
      return
    }

    if (line === 'Creating release...') {
      this.output.info('🐙 Creating a release in Octopus Deploy...')
      return
    }

    if (line.includes('Octopus Deploy Command Line Tool')) {
      const version = line.split('version ')[1]
      this.output.info(`🐙 Using Octopus Deploy CLI ${version}...`)
      return
    }

    if (line.includes('Handshaking with Octopus Server')) {
      this.output.info(`🤝 Handshaking with Octopus Deploy`)
      return
    }

    if (line.includes('Authenticated as:')) {
      this.output.info(`✅ Authenticated`)
      return
    }

    const releaseMatch = line.match('^Release (.+) created successfully!$')
    if (releaseMatch && releaseMatch.length === 2) {
      this.outputReleaseNumber = releaseMatch[1]
      this.output.info(`🎉 ${line}`)
      return
    }

    // everything else just pass-through
    this.output.info(line)
  }
}

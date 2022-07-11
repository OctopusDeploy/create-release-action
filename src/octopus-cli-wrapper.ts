import { InputParameters } from './input-parameters'

export class OctopusCliWrapper {
  // environment variables at the time the wrapper was created
  env: { [key: string]: string } | NodeJS.ProcessEnv
  logInfo: (message: string) => void
  logWarn: (message: string) => void

  constructor(
    env: { [key: string]: string } | NodeJS.ProcessEnv,
    logInfo: (message: string) => void,
    logWarn: (message: string) => void
  ) {
    this.env = env
    this.logInfo = logInfo
    this.logWarn = logWarn
  }

  stdline(line: string) {
    if (line.length === 0) {
      return
    }

    if (line.includes('Octopus Deploy Command Line Tool')) {
      const version = line.split('version ')[1]
      this.logInfo(`🐙 Using Octopus Deploy CLI ${version}...`)
      return
    }

    if (line.includes('Handshaking with Octopus Server')) {
      this.logInfo(`🤝 Handshaking with Octopus Deploy`)
      return
    }

    if (line.includes('Authenticated as:')) {
      this.logInfo(`✅ Authenticated`)
      return
    }

    if (line.includes(' created successfully!')) {
      this.logInfo(`🎉 ${line}`)
      return
    }

    switch (line) {
      case 'Creating release...':
        this.logInfo('🐙 Creating a release in Octopus Deploy...')
        break
      default:
        this.logInfo(`${line}`)
        break
    }
  }

  pickupConfigurationValueExtended(
    inputParameter: string,
    inputObsoleteEnvKey: string,
    inputNewEnvKey: string,
    valueHandler: (value: string) => void
  ) {
    if (inputParameter.length > 0) {
      valueHandler(inputParameter)
    } else {
      const deprecatedValue = this.env[inputObsoleteEnvKey]
      const value = this.env[inputNewEnvKey]
      if (deprecatedValue && deprecatedValue.length > 0) {
        this.logWarn(`Detected Deprecated ${inputObsoleteEnvKey} environment variable. Prefer ${inputNewEnvKey}`)
        valueHandler(deprecatedValue)
      }
      // deliberately not 'else if' because if both OCTOPUS_CLI_API_KEY and OCTOPUS_API_KEY are set we want the latter to win
      if (value && value.length > 0) {
        valueHandler(value)
      }
    }
  }

  pickupConfigurationValue(inputParameter: string, inputNewEnvKey: string, valueHandler: (value: string) => void) {
    if (inputParameter.length > 0) {
      valueHandler(inputParameter)
    } else {
      const value = this.env[inputNewEnvKey]
      if (value && value.length > 0) {
        valueHandler(value)
      }
    }
  }

  // mapping table:
  // apiKey: getEnv(['OCTOPUS_HOST', 'OCTOPUS_CLI_API_KEY']),
  // proxy: getEnv(['OCTOPUS_PROXY']),
  // proxyPassword: getEnv(['OCTOPUS_PROXY_PASSWORD']),
  // proxyUsername: getEnv(['OCTOPUS_PROXY_USERNAME']),
  // server: getEnv(['OCTOPUS_HOST', 'OCTOPUS_CLI_SERVER']),
  // space: getEnv(['OCTOPUS_SPACE'])

  // Converts incoming environment and inputParameters into an array of strings to pass to the Octopus CLI
  generateLaunchConfig(parameters: InputParameters): CliLaunchConfiguration {
    // Note: this is specialised to only work for create-release, but feels like it wants to be more generic and reusable?
    // Given we have multiple github actions and each lives in its own repo, what's our strategy for sharing here?
    const launchArgs: string[] = ['create-release']
    const launchEnv: { [key: string]: string } = {}

    this.pickupConfigurationValueExtended(
      parameters.apiKey,
      'OCTOPUS_CLI_API_KEY',
      'OCTOPUS_API_KEY',
      value => (launchEnv['OCTOPUS_CLI_API_KEY'] = value)
    )

    this.pickupConfigurationValueExtended(
      parameters.server,
      'OCTOPUS_CLI_SERVER',
      'OCTOPUS_HOST',
      value => (launchEnv['OCTOPUS_CLI_SERVER'] = value)
    )

    this.pickupConfigurationValue(parameters.proxy, 'OCTOPUS_PROXY', value => launchArgs.push(`--proxy=${value}`))

    this.pickupConfigurationValue(parameters.proxyPassword, 'OCTOPUS_PROXY_PASSWORD', value =>
      launchArgs.push(`--proxyPass=${value}`)
    )
    this.pickupConfigurationValue(parameters.proxyUsername, 'OCTOPUS_PROXY_USERNAME', value =>
      launchArgs.push(`--proxyUser=${value}`)
    )

    this.pickupConfigurationValue(parameters.space, 'OCTOPUS_SPACE', value => launchArgs.push(`--space=${value}`))

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
}

// When launching the Octopus CLI, we use a combination of environment variables and command line
// arguments. This interface carries them
export interface CliLaunchConfiguration {
  args: string[]
  env: { [key: string]: string }
}

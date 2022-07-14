import { exec, ExecOptions } from '@actions/exec'
import { InputParameters } from './input-parameters'

// environment variables can either be a NodeJS.ProcessEnv or a plain old object with string keys/values for testing
type EnvVars = { [key: string]: string } | NodeJS.ProcessEnv

export class OctopusCliWrapper {
  inputParameters: InputParameters
  // environment variables at the time the wrapper was created
  env: EnvVars
  logInfo: (message: string) => void
  logWarn: (message: string) => void

  // if we parse CLI output and see a release number, it will get stashed here for later retrival
  outputReleaseNumber: string | undefined

  constructor(
    parameters: InputParameters,
    env: EnvVars,
    logInfo: (message: string) => void,
    logWarn: (message: string) => void
  ) {
    this.inputParameters = parameters
    this.env = env
    this.logInfo = logInfo
    this.logWarn = logWarn
  }

  // When the Octopus CLI writes to stdout, we capture the text via this function
  stdline(line: string): void {
    if (line.length === 0) {
      return
    }

    if (line === 'Creating release...') {
      this.logInfo('🐙 Creating a release in Octopus Deploy...')
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

    const releaseMatch = line.match('^Release (.+) created successfully!$')
    if (releaseMatch && releaseMatch.length === 2) {
      this.outputReleaseNumber = releaseMatch[1]
      this.logInfo(`🎉 ${line}`)
      return
    }

    // everything else just pass-through
    this.logInfo(line)
  }

  // Picks up a config value from GHA Input or environment, supports mapping
  // of an obsolete env var to a newer one (e.g. OCTOPUS_CLI_SERVER vs OCTOPUS_HOST)
  pickupConfigurationValueExtended(
    inputParameter: string,
    inputObsoleteEnvKey: string,
    inputNewEnvKey: string,
    valueHandler: (value: string) => void
  ): void {
    // we always want to log the warning for a deprecated environment variable, even if the parameter comes in via inputParameter
    let result: string | undefined

    const deprecatedValue = this.env[inputObsoleteEnvKey]
    if (deprecatedValue && deprecatedValue.length > 0) {
      this.logWarn(`Detected Deprecated ${inputObsoleteEnvKey} environment variable. Prefer ${inputNewEnvKey}`)
      result = deprecatedValue
    }
    const value = this.env[inputNewEnvKey]
    // deliberately not 'else if' because if both OCTOPUS_CLI_API_KEY and OCTOPUS_API_KEY are set we want the latter to win
    if (value && value.length > 0) {
      result = value
    }
    if (inputParameter.length > 0) {
      result = inputParameter
    }
    if (result) {
      valueHandler(result)
    }
  }

  // Picks up a config value from GHA Input or environment
  pickupConfigurationValue(
    inputParameter: string,
    inputNewEnvKey: string,
    valueHandler: (value: string) => void
  ): void {
    if (inputParameter.length > 0) {
      valueHandler(inputParameter)
    } else {
      const value = this.env[inputNewEnvKey]
      if (value && value.length > 0) {
        valueHandler(value)
      }
    }
  }

  // Converts incoming environment and inputParameters into a set of commandline args + env vars to run the Octopus CLI
  generateLaunchConfig(): CliLaunchConfiguration {
    const launchArgs: string[] = ['create-release']
    const launchEnv: { [key: string]: string } = {}

    const parameters = this.inputParameters

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

    this.pickupConfigurationValue(parameters.proxyUsername, 'OCTOPUS_PROXY_USERNAME', value =>
      launchArgs.push(`--proxyUser=${value}`)
    )
    this.pickupConfigurationValue(parameters.proxyPassword, 'OCTOPUS_PROXY_PASSWORD', value =>
      launchArgs.push(`--proxyPass=${value}`)
    )

    this.pickupConfigurationValue(parameters.space, 'OCTOPUS_SPACE', value => launchArgs.push(`--space=${value}`))

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

  // This invokes the CLI to do the work.
  // Returns the release number assigned by the octopus server
  // This shells out to 'octo' and expects to be running in GHA, so you can't unit test it; integration tests only.
  async createRelease(octoExecutable = 'octo'): Promise<string | undefined> {
    const cliLaunchConfiguration = this.generateLaunchConfig()

    this.logInfo(JSON.stringify({ exe: octoExecutable, config: cliLaunchConfiguration }))

    const options: ExecOptions = {
      listeners: {
        stdline: input => this.stdline(input)
      },
      env: cliLaunchConfiguration.env,
      silent: true
    }

    // process.env.OCTOPUS_CLI_API_KEY = cliLaunchConfiguration.env.OCTOPUS_CLI_API_KEY
    // process.env.OCTOPUS_CLI_SERVER = cliLaunchConfiguration.env.OCTOPUS_CLI_SERVER

    try {
      const exitCode = await exec(octoExecutable, cliLaunchConfiguration.args, options)
      this.logInfo(`Octopus CLI succeeded with exit code ${exitCode}`)
      return this.outputReleaseNumber
    } catch (e: unknown) {
      if (e instanceof Error) {
        // catch some particular messages and rethrow more convenient ones
        if (e.message.includes('Unable to locate executable file')) {
          throw new Error(
            'Octopus CLI executable missing. Please ensure you have added the `OctopusDeploy/install-octopus-cli-action@v1` step to your GitHub actions script before this.'
          )
        }
        // if (e.message.includes('failed with exit code')) {
        //   throw new Error('Octopus CLI returned an error code. Please check your GitHub actions log for more detail')
        // }
      }
      // rethrow, so our Promise is rejected. The GHA shim in index.ts will catch this and call setFailed
      throw e
    }
  }
}

// When launching the Octopus CLI, we use a combination of environment variables and command line
// arguments. This interface carries them
export interface CliLaunchConfiguration {
  args: string[]
  env: { [key: string]: string }
}

import { InputParameters } from './input-parameters'

export class OctopusCliWrapper {
  logInfo: (message: string) => void
  logWarn: (message: string) => void

  constructor(
    logInfo: (message: string) => void,
    logWarn: (message: string) => void
  ) {
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

  // Converts incoming environment and inputParameters into an array of strings to pass to the Octopus CLI
  generateLaunchConfig(
    env: { [key: string]: string } | NodeJS.ProcessEnv,
    parameters: InputParameters
  ): CliLaunchConfiguration {
    // Note: this is specialised to only work for create-release, but feels like it wants to be more generic and reusable?
    // Given we have multiple github actions and each lives in its own repo, what's our strategy for sharing here?
    const launchArgs: string[] = ['create-release']
    const launchEnv: { [key: string]: string } = {}

    if (parameters.apiKey.length > 0) {
      launchEnv['OCTOPUS_CLI_API_KEY'] = parameters.apiKey
    } else {
      const deprecatedApiKey = env['OCTOPUS_CLI_API_KEY']
      const apiKey = env['OCTOPUS_API_KEY']
      if (deprecatedApiKey && deprecatedApiKey.length > 0) {
        this.logWarn(
          'Detected Deprecated OCTOPUS_CLI_API_KEY environment variable. Prefer OCTOPUS_API_KEY'
        )
        launchEnv['OCTOPUS_CLI_API_KEY'] = deprecatedApiKey
      }
      // deliberately not 'else if' because if both OCTOPUS_CLI_API_KEY and OCTOPUS_API_KEY are set we want the latter to win
      if (apiKey && apiKey.length > 0) {
        launchEnv['OCTOPUS_CLI_API_KEY'] = apiKey
      }
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
    if (parameters.proxy.length > 0) {
      launchArgs.push(`--proxy=${parameters.proxy}`)
    }
    if (parameters.proxyPassword.length > 0) {
      launchArgs.push(`--proxyPass=${parameters.proxyPassword}`)
    }
    if (parameters.proxyUsername.length > 0) {
      launchArgs.push(`--proxyUser=${parameters.proxyUsername}`)
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
    if (parameters.server.length > 0) {
      launchArgs.push(`--server=${parameters.server}`)
    }
    if (parameters.space.length > 0) {
      launchArgs.push(`--space=${parameters.space}`)
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

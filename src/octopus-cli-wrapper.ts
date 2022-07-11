import { InputParameters } from './input-parameters'

export class OctopusCliWrapper {
  logInfo: (message: string) => void

  constructor(logInfo: (message: string) => void) {
    this.logInfo = logInfo
  }

  processLine(line: string) {
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
}

// Converts inputParameters into an array of strings to pass to the Octopus CLI
export function generateCommandLine(parameters: InputParameters): string[] {
  // Note: this is specialised to only work for create-release, but feels like it wants to be more generic and reusable?
  // Given we have multiple github actions and each lives in its own repo, what's our strategy for sharing here?
  const args = ['create-release']

  if (parameters.apiKey.length > 0) {
    args.push(`--apiKey=${parameters.apiKey}`)
  }
  if (parameters.channel.length > 0) {
    args.push(`--channel=${parameters.channel}`)
  }
  if (parameters.ignoreExisting) {
    args.push(`--ignoreExisting`)
  }
  if (parameters.gitRef.length > 0) {
    args.push(`--gitRef=${parameters.gitRef}`)
  }
  if (parameters.gitCommit.length > 0) {
    args.push(`--gitCommit=${parameters.gitCommit}`)
  }
  if (parameters.packages.length > 0) {
    parameters.packages.map(p => args.push(`--package=${p}`))
  }
  if (parameters.packageVersion.length > 0) {
    args.push(`--packageVersion=${parameters.packageVersion}`)
  }
  if (parameters.proxy.length > 0) {
    args.push(`--proxy=${parameters.proxy}`)
  }
  if (parameters.proxyPassword.length > 0) {
    args.push(`--proxyPass=${parameters.proxyPassword}`)
  }
  if (parameters.proxyUsername.length > 0) {
    args.push(`--proxyUser=${parameters.proxyUsername}`)
  }
  if (parameters.releaseNotes.length > 0) {
    args.push(`--releaseNotes=${parameters.releaseNotes}`)
  }
  if (parameters.releaseNotesFile.length > 0) {
    args.push(`--releaseNotesFile=${parameters.releaseNotesFile}`)
  }
  if (parameters.releaseNumber.length > 0) {
    args.push(`--releaseNumber=${parameters.releaseNumber}`)
  }
  if (parameters.server.length > 0) {
    args.push(`--server=${parameters.server}`)
  }
  if (parameters.space.length > 0) {
    args.push(`--space=${parameters.space}`)
  }
  return args
}

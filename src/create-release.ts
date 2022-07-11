import { info, setFailed, warning } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { InputParameters } from './input-parameters'

function getArgs(parameters: InputParameters): string[] {
  info('🔣 Parsing inputs...')

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

export async function createRelease(
  parameters: InputParameters
): Promise<void> {
  const args = getArgs(parameters)
  const options: ExecOptions = {
    listeners: {
      stdline: (line: string) => {
        if (line.length === 0) return

        if (line.includes('Octopus Deploy Command Line Tool')) {
          const version = line.split('version ')[1]
          info(`🐙 Using Octopus Deploy CLI ${version}...`)
          return
        }

        if (line.includes('Handshaking with Octopus Server')) {
          info(`🤝 Handshaking with Octopus Deploy`)
          return
        }

        if (line.includes('Authenticated as:')) {
          info(`✅ Authenticated`)
          return
        }

        if (line.includes(' created successfully!')) {
          info(`🎉 ${line}`)
          return
        }

        switch (line) {
          case 'Creating release...':
            info('🐙 Creating a release in Octopus Deploy...')
            break
          default:
            info(`${line}`)
            break
        }
      }
    },
    silent: true
  }

  try {
    await exec('octo', args, options)
  } catch (e: unknown) {
    if (e instanceof Error) {
      setFailed(e)
    }
  }
}

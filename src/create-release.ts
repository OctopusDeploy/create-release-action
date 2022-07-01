import { info, setFailed, warning } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { InputParameters } from './input-parameters'

function getArgs(parameters: InputParameters): string[] {
  info('🔣 Parsing inputs...')

  const args = ['create-release']

  if (parameters.apiKey.length > 0) args.push(`--apiKey=${parameters.apiKey}`)
  if (parameters.cancelOnTimeout) args.push(`--cancelOnTimeout`)
  if (parameters.channel.length > 0)
    args.push(`--channel=${parameters.channel}`)
  if (parameters.configFile.length > 0)
    args.push(`--configFile=${parameters.configFile}`)
  if (parameters.debug) args.push(`--debug`)
  if (parameters.defaultPackageVersion) args.push(`--defaultPackageVersion`)
  if (parameters.deployAt.length > 0)
    args.push(`--deployAt=${parameters.deployAt}`)
  if (parameters.deployTo.length > 0)
    args.push(`--deployTo=${parameters.deployTo}`)
  if (
    parameters.deploymentCheckSleepCycle.length > 0 &&
    parameters.deploymentCheckSleepCycle !== `00:00:10`
  )
    args.push(
      `--deploymentCheckSleepCycle=${parameters.deploymentCheckSleepCycle}`
    )
  if (
    parameters.deploymentTimeout.length > 0 &&
    parameters.deploymentTimeout !== `00:00:10`
  )
    args.push(`--deploymentTimeout=${parameters.deploymentTimeout}`)
  if (parameters.excludeMachines.length > 0)
    args.push(`--excludeMachines=${parameters.excludeMachines}`)
  if (parameters.force) args.push(`--force`)
  if (parameters.forcePackageDownload) args.push(`--forcePackageDownload`)
  if (
    parameters.guidedFailure &&
    parameters.guidedFailure.toLowerCase() === 'true'
  )
    args.push(`--guidedFailure=True`)
  if (parameters.ignoreChannelRules) args.push(`--ignoreChannelRules`)
  if (parameters.ignoreExisting) args.push(`--ignoreExisting`)
  if (parameters.ignoreSslErrors) args.push(`--ignoreSslErrors`)
  if (parameters.logLevel.length > 0 && parameters.logLevel !== `debug`)
    args.push(`--logLevel=${parameters.logLevel}`)
  if (parameters.gitRef.length > 0) args.push(`--gitRef=${parameters.gitRef}`)
  if (parameters.gitCommit.length > 0)
    args.push(`--gitCommit=${parameters.gitCommit}`)
  if (parameters.noDeployAfter.length > 0)
    args.push(`--noDeployAfter=${parameters.noDeployAfter}`)
  if (parameters.noRawLog) args.push(`--noRawLog`)

  // deprecated
  if (parameters.package.length > 0) {
    warning(
      `"package" input option specified. This option is deprecated and will be removed in a future release. Please use "packages" instead.`
    )
    args.push(`--package=${parameters.package}`)
  }

  if (parameters.packages.length > 0)
    parameters.packages.map(p => args.push(`--package=${p}`))
  if (parameters.packagePrerelease.length > 0)
    args.push(`--packagePrerelease=${parameters.packagePrerelease}`)
  if (parameters.packageVersion.length > 0)
    args.push(`--packageVersion=${parameters.packageVersion}`)
  if (parameters.packagesFolder.length > 0)
    args.push(`--packagesFolder=${parameters.packagesFolder}`)
  if (parameters.password.length > 0) args.push(`--pass=${parameters.password}`)
  if (parameters.progress) args.push(`--progress`)
  if (parameters.project.length > 0)
    args.push(`--project=${parameters.project}`)
  if (parameters.proxy.length > 0) args.push(`--proxy=${parameters.proxy}`)
  if (parameters.proxyPassword.length > 0)
    args.push(`--proxyPass=${parameters.proxyPassword}`)
  if (parameters.proxyUsername.length > 0)
    args.push(`--proxyUser=${parameters.proxyUsername}`)
  if (parameters.rawLogFile.length > 0)
    args.push(`--rawLogFile=${parameters.rawLogFile}`)
  if (parameters.releaseNotes.length > 0)
    args.push(`--releaseNotes=${parameters.releaseNotes}`)
  if (parameters.releaseNotesFile.length > 0)
    args.push(`--releaseNotesFile=${parameters.releaseNotesFile}`)
  if (parameters.releaseNumber.length > 0)
    args.push(`--releaseNumber=${parameters.releaseNumber}`)
  if (parameters.server.length > 0) args.push(`--server=${parameters.server}`)
  if (parameters.skip.length > 0) args.push(`--skip=${parameters.skip}`)
  if (parameters.space.length > 0) args.push(`--space=${parameters.space}`)
  if (parameters.specificMachines.length > 0)
    args.push(`--specificMachines=${parameters.specificMachines}`)

  // deprecated
  if (parameters.tenant.length > 0) {
    warning(
      `"tenant" input option specified. This option is deprecated and will be removed in a future release. Please use "tenants" instead.`
    )
    args.push(`--tenant=${parameters.tenant}`)
  }

  if (parameters.tenants.length > 0)
    parameters.tenants.map(t => args.push(`--tenant=${t}`))

  // deprecated
  if (parameters.tenantTag.length > 0) {
    warning(
      `"tenant_tag" input option specified. This option is deprecated and will be removed in a future release. Please use "tenant_tags" instead.`
    )
    args.push(`--tenantTag=${parameters.tenantTag}`)
  }

  if (parameters.tenantTags.length > 0)
    parameters.tenantTags.map(t => args.push(`--tenantTag=${t}`))
  if (parameters.timeout.length > 0 && parameters.timeout !== `600`)
    args.push(`--timeout=${parameters.timeout}`)
  if (parameters.username.length > 0) args.push(`--user=${parameters.username}`)

  // deprecated
  if (parameters.variable.length > 0) {
    warning(
      `"variable" input option specified. This option is deprecated and will be removed in a future release. Please use "variables" instead.`
    )
    args.push(`--variable=${parameters.variable}`)
  }

  if (parameters.variables.length > 0)
    parameters.variables.map(v => args.push(`--variable=${v}`))
  if (parameters.waitForDeployment) args.push(`--waitForDeployment`)
  if (parameters.whatIf) args.push(`--whatIf`)

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

import { info, setFailed, warning } from '@actions/core'
import { exec, ExecOptions } from '@actions/exec'
import { InputParameters } from './input-parameters'

function getArgs(parameters: InputParameters): string[] {
  info('🔣 Parsing inputs...')

  const args = ['deploy-release']

  if (parameters.apiKey.length > 0) args.push(`--apiKey=${parameters.apiKey}`)
  if (parameters.deployTo.length > 0)
    args.push(`--deployTo=${parameters.deployTo}`)
  if (parameters.gitRef.length > 0) args.push(`--gitRef=${parameters.gitRef}`)
  if (parameters.gitCommit.length > 0)
    args.push(`--gitCommit=${parameters.gitCommit}`)

  // deprecated

  if (parameters.progress) args.push(`--progress`)
  if (parameters.project.length > 0)
    args.push(`--project=${parameters.project}`)
  if (parameters.releaseNumber.length > 0)
    args.push(`--releaseNumber=${parameters.releaseNumber}`)
  if (parameters.server.length > 0) args.push(`--server=${parameters.server}`)
  if (parameters.space.length > 0) args.push(`--space=${parameters.space}`)

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


  return args
}

export async function deployRelease(
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

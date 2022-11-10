import { InputParameters } from './input-parameters'
import { Client, createRelease, CreateReleaseCommandV1 } from '@octopusdeploy/api-client'

export async function createReleaseFromInputs(client: Client, parameters: InputParameters): Promise<string> {
  client.info('🐙 Creating a release in Octopus Deploy...')

  const command: CreateReleaseCommandV1 = {
    spaceName: parameters.space,
    projectName: parameters.project,
    channelName: parameters.channel,
    releaseVersion: parameters.releaseNumber,
    packageVersion: parameters.packageVersion,
    packages: parameters.packages,
    gitRef: parameters.gitRef,
    gitCommit: parameters.gitCommit,
    releaseNotes: parameters.releaseNotes,
    ignoreIfAlreadyExists: parameters.ignoreExisting,
    ignoreChannelRules: false
  }

  client.debug(`CMD: ${command}`)

  const allocatedReleaseNumber = await createRelease(client, command)

  client.info(`🎉 Release ${allocatedReleaseNumber.releaseVersion} created successfully!`)

  return allocatedReleaseNumber.releaseVersion
}

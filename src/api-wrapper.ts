import { InputParameters } from './input-parameters'
import { Client, CreateReleaseCommandV1, releaseCreate } from '@octopusdeploy/api-client'

export async function createReleaseFromInputs(client: Client, parameters: InputParameters): Promise<string> {
  client.info('🐙 Creating a release in Octopus Deploy...')

  const command: CreateReleaseCommandV1 = {
    spaceName: parameters.space,
    ProjectName: parameters.project,
    ChannelName: parameters.channel,
    ReleaseVersion: parameters.releaseNumber,
    PackageVersion: parameters.packageVersion,
    Packages: parameters.packages,
    GitRef: parameters.gitRef,
    GitCommit: parameters.gitCommit,
    ReleaseNotes: parameters.releaseNotes,
    IgnoreIfAlreadyExists: parameters.ignoreExisting,
    IgnoreChannelRules: false
  }

  const allocatedReleaseNumber = await releaseCreate(client, command)

  client.info(`🎉 Release ${allocatedReleaseNumber.ReleaseVersion} created successfully!`)

  return allocatedReleaseNumber.ReleaseVersion
}

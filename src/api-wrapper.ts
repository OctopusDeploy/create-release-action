import { InputParameters } from './input-parameters'
import { Client, CreateReleaseCommandV1, ReleaseRepository } from '@octopusdeploy/api-client'
import fs from 'fs'

export async function createReleaseFromInputs(client: Client, parameters: InputParameters): Promise<string> {
  client.info('🐙 Creating a release in Octopus Deploy...')

  let releaseNotes = parameters.releaseNotes
  if (parameters.releaseNotesFile) {
    const data = fs.readFileSync(parameters.releaseNotesFile)
    releaseNotes = data.toString()
  }

  const command: CreateReleaseCommandV1 = {
    spaceName: parameters.space,
    ProjectName: parameters.project,
    ChannelName: parameters.channel,
    ReleaseVersion: parameters.releaseNumber,
    PackageVersion: parameters.packageVersion,
    Packages: parameters.packages,
    GitRef: parameters.gitRef,
    GitCommit: parameters.gitCommit,
    ReleaseNotes: releaseNotes,
    IgnoreIfAlreadyExists: parameters.ignoreExisting,
    IgnoreChannelRules: false
  }

  const repository = new ReleaseRepository(client, parameters.space)
  const allocatedReleaseNumber = await repository.create(command)

  client.info(`🎉 Release ${allocatedReleaseNumber.ReleaseVersion} created successfully!`)

  return allocatedReleaseNumber.ReleaseVersion
}

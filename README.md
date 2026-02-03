# create-release-action

<img alt= "" src="https://github.com/OctopusDeploy/create-release-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to create a release in [Octopus Deploy](https://octopus.com/).

> [!NOTE]
> If you have used earlier versions of this action, as of **v3** of this action there is no longer a dependency to the Octopus CLI, so the installer action is no longer required in order to use this step.

> [!IMPORTANT]
> As of **v3** of this action, Octopus Server version `2022.3.5512` or newer is required.

## Releases in Octopus Deploy

A release is a snapshot of the deployment process and the associated assets (packages, scripts, variables) as they existed when the release was created. The release is given a version number, and you can deploy that release as many times as you need to, even if parts of the deployment process have changed since the release was created (those changes will be included in future releases but not in this version).

When you deploy the release, you are executing the deployment process with all the associated details, as they existed when the release was created.

More information about releases in Octopus Deploy:

- [Releases](https://octopus.com/docs/releases)

## Migration Guide(s)

Please refer to the [migration guide](migration-guide.md) if moving between major versions of this action.

## Examples

Incorporate the following actions in your workflow to create a release in Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
env:
  OCTOPUS_API_KEY: ${{ secrets.API_KEY  }}
  OCTOPUS_URL: ${{ secrets.OCTOPUS_URL }}
  OCTOPUS_SPACE: 'Outer Space'
steps:
  # ...
  - name: Create a release in Octopus Deploy 🐙
    id: create_a_release_in_octopus_deploy
    uses: OctopusDeploy/create-release-action@v4
    with:
      project: 'MyProject'
```

To use an version controlled Octopus project, add the `git_ref` and `git_commit` fields:

```yml
env:
  OCTOPUS_API_KEY: ${{ secrets.API_KEY  }}
  OCTOPUS_URL: ${{ secrets.OCTOPUS_URL }}
  OCTOPUS_SPACE: 'Outer Space'
steps:
  # ...
  - name: Create a release in Octopus Deploy 🐙
    id: create_a_release_in_octopus_deploy  
    uses: OctopusDeploy/create-release-action@v4
    with:
      project: 'MyProject'
      git_ref: ${{ (github.ref_type == 'tag' && github.event.repository.default_branch ) || (github.head_ref || github.ref) }}
      git_commit: ${{ github.event.after || github.event.pull_request.head.sha }}
```

To specify the version of a package referenced in a step to use in the release, add the `packages` field:

```yml
env:
  OCTOPUS_API_KEY: ${{ secrets.API_KEY  }}
  OCTOPUS_URL: ${{ secrets.OCTOPUS_URL }}
  OCTOPUS_SPACE: 'Outer Space'
steps:
  # ...
  - name: Create a release in Octopus Deploy 🐙
    id: create_a_release_in_octopus_deploy  
    uses: OctopusDeploy/create-release-action@v4
    with:
      project: 'MyProject'
      packages: |
        StepName:PackageReferenceName:Version
        PackageID:Version
```

## ✍️ Environment Variables

| Name              | Description                                                                                                                                          |
| :---------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OCTOPUS_URL`     | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is strongly recommended that this value retrieved from a GitHub secret. |
| `OCTOPUS_API_KEY` | The API key used to access Octopus Deploy. It is strongly recommended that this value retrieved from a GitHub secret.                                |
| `OCTOPUS_SPACE`   | The Name of a space within which this command will be executed.                                                                                      |

## 📥 Inputs

| Name                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|:---------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `project`            | **Required.** The name of the project associated with this release.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `release_number`     | The number for the new release. If omitted, Octopus Deploy will generate a release number.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `channel`            | The name of the channel to use for the new release. If omitted, the best channel will be selected.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `package_version`    | The version number of all packages to use for this release.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `packages`           | A multi-line list of version numbers to use for a package in the release. Format: StepName:Version or PackageID:Version or StepName:PackageName:Version. StepName, PackageID, and PackageName can be replaced with an asterisk ("\*"). An asterisk will be assumed for StepName, PackageID, or PackageName if they are omitted. **NOTE** these values should not be enclosed in single-quotes (`'`)                                                                                                                                                                                        |
| `git_ref`            | Git reference, _branch name or tag_, to the specific resources of a version controlled Octopus Project. This should be used for version controlled projects when OCL files are stored in a different repository or branch as the application being built. E.g. Use the `main` branch, regardless of the location of the repository where the application(s) are being built as they are different **or** `${{ github.ref }}` to use the branch or tag ref that triggered the workflow.                                                                                                     |
| `git_commit`         | Git commit, _commit SHA-1 hash_, pointing to the specific resources of a version controlled Octopus Project. This should be used for version controlled projects when OCL files are stored in the same repository or branch as the application being built. E.g. `${{ github.event.after \|\| github.event.pull_request.head.sha }}` to use the commit that triggered the workflow.                                                                                                                                                                                                        |
| `ignore_existing`    | Ignore existing releases if present in Octopus Deploy with the matching version number. Defaults to **false**                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `release_notes`      | The release notes text associated with the new release (Markdown is supported).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `release_notes_file` | A file containing the release notes associated with the new release (Markdown is supported). Use either `release_notes` or this input, supplying both is not supported.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `server`             | The instance URL hosting Octopus Deploy (i.e. "https://octopus.example.com/"). The instance URL is required, but you may also use the OCTOPUS_URL environment variable.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `api_key`            | The API key used to access Octopus Deploy. An API key is required, but you may also use the OCTOPUS_API_KEY environment variable. It is strongly recommended that this value retrieved from a GitHub secret.                                                                                                                                                                                                                                                                                                                                                                               |
| `space`              | The name of a space within which this command will be executed. The space name is required, but you may also use the OCTOPUS_SPACE environment variable.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `custom_fields`      | A multi-line string of custom fields for the release. Format:<br/>customFieldName:customFieldValue<br/>customFieldName2:customFieldValue2                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## 📤 Outputs

| Name             | Description                                                                                                                     |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `release_number` | The Octopus Deploy release number assigned to the Release. Use this if you wish to refer to the release later in your workflow. |

## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](.github/CONTRIBUTING.md) for information about how to get involved in this project.

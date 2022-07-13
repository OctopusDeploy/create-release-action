# create-release-action

<img alt= "" src="https://github.com/OctopusDeploy/create-release-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to create a release in [Octopus Deploy](https://octopus.com/). It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Releases in Octopus Deploy

A release is a snapshot of the deployment process and the associated assets (packages, scripts, variables) as they existed when the release was created. The release is given a version number, and you can deploy that release as many times as you need to, even if parts of the deployment process have changed since the release was created (those changes will be included in future releases but not in this version).

When you deploy the release, you are executing the deployment process with all the associated details, as they existed when the release was created.

More information about releases in Octopus Deploy:

- [Releases](https://octopus.com/docs/releases)
- [Create release](https://octopus.com/docs/octopus-rest-api/octopus-cli/create-release)

## Migration Guide(s)

Please refer to the [migration guide](migration-guide.md) if moving between major versions of this action.

## Examples

Incorporate the following actions in your workflow to create a release in Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
env:

steps:
  # ...
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@v1
    with:
      version: latest

  - name: Create a release in Octopus Deploy 🐙
    uses: OctopusDeploy/create-release-action@v2
    env:
      OCTOPUS_API_KEY: ${{ secrets.API_KEY  }}
      OCTOPUS_HOST: ${{ secrets.SERVER }}
      OCTOPUS_SPACE: 'Spaces-1'
    with:
      project: 'MyProject'
```

## ✍️ Environment Variables

| Name                     | Description                                                                                                                                                                                                                                      |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OCTOPUS_API_KEY`        | The API key used to access Octopus Deploy. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value retrieved from a GitHub secret.                                                                   |
| `OCTOPUS_HOST`           | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is strongly recommended that this value retrieved from a GitHub secret.                                                                                             |
| `OCTOPUS_PROXY`          | The URL of a proxy to use (i.e. `https://proxy.example.com`). If `OCTOPUS_PROXY_USERNAME` and `OCTOPUS_PROXY_PASSWORD` are omitted, the default credentials are used. It is strongly recommended that this value retrieved from a GitHub secret. |
| `OCTOPUS_PROXY_PASSWORD` | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                 |
| `OCTOPUS_PROXY_USERNAME` | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                 |
| `OCTOPUS_SPACE`          | The ID of a space within which this command will be executed.                                                                                                                                                                                    |

## 📥 Inputs

| Name                 | Description                                                                                                                                                                                                                                                                                                                     |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `project`            | **Required.** The name or ID of the project associated with this release.                                                                                                                                                                                                                                                       |
| `api_key`            | The API key used to access Octopus Deploy. An API key is required, but you may also use the `OCTOPUS_API_KEY` environment variable. If the guest account is enabled, a key of API-GUEST may be used. It is strongly recommended that this value retrieved from a GitHub secret.                                                 |
| `server`             | The base URL hosting Octopus Deploy (i.e. "https://octopus.example.com/"). The Server URL is required, but you may also use the `OCTOPUS_HOST` environment variable.                                                                                                                                                            |
| `release_number`     | The number for the new release. If omitted, Octopus Deploy will generate a release number.                                                                                                                                                                                                                                      |
| `space`              | The name or ID of a space within which this command will be executed.                                                                                                                                                                                                                                                           |
| `package_version`    | The version number of all packages to use for this release.                                                                                                                                                                                                                                                                     |
| `packages`           | A multi-line list of version numbers to use for a package in the release. Format: StepName:Version or PackageID:Version or StepName:PackageName:Version. StepName, PackageID, and PackageName can be replaced with an asterisk ("\*"). An asterisk will be assumed for StepName, PackageID, or PackageName if they are omitted. |
| `channel`            | The name or ID of the channel to use for the new release. If omitted, the best channel will be selected.                                                                                                                                                                                                                        |
| `git_ref`            | Git branch reference to the specific resources of a version controlled Octopus Project. This is required for version controlled projects.                                                                                                                                                                                       |
| `git_commit`         | Git commit pointing to the specific resources of a version controlled Octopus Project. If empty, it will use the HEAD from the corresponding gitRef parameter.                                                                                                                                                                  |
| `ignore_existing`    | Ignore existing releases if present in Octopus Deploy with the matching version number. Defaults to **false**                                                                                                                                                                                                                   |
| `proxy`              | The URL of a proxy to use (i.e. https://proxy.example.com). You may also use the `OCTOPUS_PROXY` environment variable.                                                                                                                                                                                                          |
| `proxy_username`     | The username used to connect to a proxy. You may also use the `OCTOPUS_PROXY_USERNAME` environment variable. It is strongly recommended to retrieve this value from a GitHub secret.                                                                                                                                            |
| `proxy_password`     | The password used to connect to a proxy. You may also use the `OCTOPUS_PROXY_PASSWORD` environment variable. It is strongly recommended to retrieve this value from a GitHub secret. If proxy_username and proxy_password are omitted and proxy URL is specified, the default credentials are used.                             |
| `release_notes`      | The release notes associated with the new release (Markdown is supported).                                                                                                                                                                                                                                                      |
| `release_notes_file` | Path to a file that contains release notes for the new release. Supports Markdown files.                                                                                                                                                                                                                                        |

## 📤 Outputs

| Name             | Description                                                                                                                      |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `release_number` | The release number assigned to the Release in Octopus Deploy. Use this if you wish to refer to the release later in your script. |

## 🤝 Contributions

Contributions are welcome! :heart: Please read our [Contributing Guide](.github/CONTRIBUTING.md) for information about how to get involved in this project.

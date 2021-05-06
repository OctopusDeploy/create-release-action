# create-release-action

<img alt= "" src="https://github.com/OctopusDeploy/create-release-action/raw/main/assets/github-actions-octopus.png" />

This is a GitHub Action to create a release in [Octopus Deploy](https://octopus.com/). It requires the [Octopus CLI](https://octopus.com/docs/octopus-rest-api/octopus-cli); please ensure to include [install-octopus-cli-action](https://github.com/OctopusDeploy/install-octopus-cli-action) in your workflow (example below) before using this GitHub Action.

## Releases in Octopus Deploy

A release is a snapshot of the deployment process and the associated assets (packages, scripts, variables) as they existed when the release was created. The release is given a version number, and you can deploy that release as many times as you need to, even if parts of the deployment process have changed since the release was created (those changes will be included in future releases but not in this version).

When you deploy the release, you are executing the deployment process with all the associated details, as they existed when the release was created.

More information about releases in Octopus Deploy:

* [Releases](https://octopus.com/docs/releases)
* [Create release](https://octopus.com/docs/octopus-rest-api/octopus-cli/create-release)

## Examples

Incorporate the following actions in your workflow to create a release in Octopus Deploy using an API key, a target instance (i.e. `server`), and a project:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@v1.1.6
    with:
      version: latest
  - name: Create a release in Octopus Deploy 🐙
    uses: OctopusDeploy/create-release-action@v1.0.2
    with:
      api_key: ${{ secrets.API_KEY }}
      project: "Projects-123"
      server: ${{ secrets.SERVER }}
```

Here's an example that provides a `username` and `password` to authenticate to Octopus Deploy:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI 🐙
    uses: OctopusDeploy/install-octopus-cli-action@v1.1.6
    with:
      version: latest
  - name: Create a release in Octopus Deploy 🐙
    uses: OctopusDeploy/create-release-action@v1.0.2
    with:
      password: ${{ secrets.PASSWORD }}
      project: "Projects-123"
      server: ${{ secrets.SERVER }}
      username: ${{ secrets.USERNAME }}
```

## Action Inputs

The following inputs are optional:

| Name | Description | Default |
| :- | :- | :-: |
| `api_key` | The API key used to access Octopus Deploy. This value is required if credentials (`username` and `password`) are unspecified. `API-GUEST` may be used if the guest account is enabled. It is strongly recommended that this value be retrieved from a GitHub secret. | |
| `cancel_on_timeout` | Cancel the deployment if `deployment_timeout` is exceeded (default: 10 minutes). | `false` |
| `channel` | The name or ID of the channel to use for the new release. If omitted, the best channel will be selected. |  | |
| `config_file` | The path to a configuration file of default values with one `key=value` per line. | |
| `debug` | Enable debug logging. | `false` |
| `default_package_version` | Use the default version number of all packages for this release. | `false` |
| `deploy_at` | The time at which deployment should start (scheduled deployment), specified as any valid DateTimeOffset format, and assuming the time zone is the current local time zone. | `false` |
| `deploy_to` | The name or ID of the environment to automatically deploy to (i.e. `Production` or `Environments-1`); specify this argument multiple times to deploy to multiple environments. | |
| `deployment_check_sleep_cycle` | The duration between deployment status checks (format: `HH:MM:SS`). | `00:00:10` |
| `deployment_timeout` | The duration to wait for the deployment to finish (format: `HH:MM:SS`). Note: This will not stop the deployment; the input value, `wait_for_deployment` is required. | `00:00:10` |
| `exclude_machines` | A comma-separated list of machine names to exclude in the deployed environment. If empty, all machines in the environment will be considered. | |
| `force` | If a project is configured to skip packages with already-installed versions, override this setting to force re-deployment. | `false` |
| `force_package_download` | Force download of installed packages. | `false` |
| `guided_failure` | Use [Guided Failure mode](https://octopus.com/docs/releases/guided-failures). | `false` |
| `ignore_channel_rules` | Create the release ignoring any version rules specified by the channel. | `false` |
| `ignore_existing` | Ignore existing releases if present in Octopus Deploy with the matching version number. | `false` |
| `ignore_ssl_errors` | Ignore certificate errors when communicating with Octopus Deploy. Warning: enabling this option creates a security vulnerability. | `false` |
| `log_level` | The log level; valid options are `verbose`, `debug`, `information`, `warning`, `error`, and `fatal`. | `debug` |
| `no_deploy_after` | Time at which scheduled deployment should expire, specified as any valid DateTimeOffset format, and assuming the time zone is the current local time zone. | |
| `no_raw_log` | Print the raw log of failed tasks. | `false` |
| `package` | The version number to use for a package in the release (format: `StepName:Version`, `PackageID:Version`, or `StepName:PackageName:Version`). | |
| `package_prerelease` | Pre-release for latest version of all packages to use for this release. | |
| `package_version` | The version number of all packages to use for this release. | |
| `packages_folder` | The folder designated for containing packages. | |
| `password` | The password to used to authenticate with Octopus Deploy. It is strongly recommended to retrieve this value from a GitHub secret. | |
| `progress` | Show progress of the deployment. | `false` |
| `project` | The name or ID of the project associated with this release. | |
| `proxy` | The URL of a proxy to use (i.e. `https://proxy.example.com`). | |
| `proxy_password` | The password used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. If `proxy_username` and `proxy_password` are omitted and `proxy` is specified, the default credentials are used. | |
| `proxy_username` | The username used to connect to a proxy. It is strongly recommended to retrieve this value from a GitHub secret. | |
| `raw_log_file` | Redirect the raw log of failed tasks to a file. | |
| `release_notes` | The release notes associated with the new release (Markdown is supported). | |
| `release_notes_file` | Path to a file that contains release notes for the new release. Supports Markdown files. | |
| `release_number` | The number for the new release. | |
| `server` | The base URL hosting Octopus Deploy (i.e. `https://octopus.example.com`). It is recommended to retrieve this value from an environment variable. | |
| `skip` | Skip a step by name. | |
| `space` | The name or ID of a space within which this command will be executed. If omitted, the default space will be used. | |
| `specific_machines` | A comma-separated list of machine names to target in the deployed environment. If not specified all machines in the environment will be considered. | |
| `tenant` | Create a deployment for the tenant with this name or ID; specify this argument multiple times to add multiple tenants or use a wildcard (`*`) to deploy to all tenants who are ready for this release (according to lifecycle). | |
| `tenant_tag` | Create a deployment for tenants matching this tag; specify this argument multiple times to build a query/filter with multiple tags. | |
| `timeout` | A timeout value for network operations (in seconds). | `600` |
| `username` | The username used to authenticate with Octopus Deploy. You must provide `api_key` or `username` and `password`. It is strongly recommended to retrieve this value from a GitHub secret. | |
| `variable` | Values for any prompted variables (format: `Label:Value`). For JSON values, embedded quotation marks should be escaped with a backslash. | |
| `wait_for_deployment` | Wait for deployment to finish. | `false` |
| `what_if` | Perform a dry run; do not create or deploy a release. | `false` |
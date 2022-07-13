# Migration Guide

## v1 to v2

The number of input parameters have been greatly reduced in v2 of this action. This change was made to reflect the majority of use cases observed across GitHub repositories.

Please note that the the following input parameters have been removed in v2 of this action:

- `cancel_on_timeout`
- `config_file`
- `debug`
- `default_package_version`
- `deploy_to`
- `deploy_at`
- `deployment_check_sleep_cycle`
- `deployment_timeout`
- `exclude_machines`
- `force`
- `force_package_download`
- `guided_failure`
- `ignore_channel_rules`
- `ignore_ssl_errors`
- `log_level`
- `no_raw_log`
- `package`
- `package_prerelease`
- `packages_folder`
- `password`
- `progress`
- `raw_log_file`
- `skip`
- `specific_machines`
- `tenant`
- `tenants`
- `tenant_tag`
- `tenant_tags`
- `timeout`
- `user`
- `variable`
- `variables`
- `wait_for_deployment`
- `what_if`

If you are using the `deploy_to` input parameter then it is recommended that you modify the associated lifecycle to deploy to the environment referenced by this value automatically.

This action strongly encourages the using a combination of secrets and environment variables for sensitive values such as the Octopus host or the API key. For that reason, we have modified the action to encourage users environment variables (see YAML example below).

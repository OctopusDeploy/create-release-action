This is a GitHub Action to create a release in [Octopus Deploy](https://octopus.com/).

## Examples

To create a release:

```yml
steps:
  - uses: actions/checkout@v2
  - name: Install Octopus CLI
    uses: OctopusDeploy/install-octopus-cli-action@v1.1.1
    with:
      version: latest
  - name: Create a release in Octopus Deploy
    uses: OctopusDeploy/create-release-action@v1.0.0
    with:
      api_key: ${{ secrets.API_KEY }}
      server: ${{ secrets.SERVER }}
      project: "Projects-123"
```

## Action Inputs

| Name | Description | Required | Default |
| :- | :- | :-: | :-: |
| `api_key` | The API key used to access Octopus Deploy. You must provide an API key or username and password. If the guest account is enabled, a key of API-GUEST may be used. It is strongly recommended that this value retrieved from a GitHub secret. | `false` | |
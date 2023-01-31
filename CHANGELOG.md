# Changelog

## [3.0.3](https://github.com/OctopusDeploy/create-release-action/compare/v3.0.2...v3.0.3) (2023-01-31)


### Bug Fixes

* Updated client library to get better error messages capabilities and required Octopus version ([072c13b](https://github.com/OctopusDeploy/create-release-action/commit/072c13b5a0ddccc663a0c0d8b098229b40c65690))

## [3.0.2](https://github.com/OctopusDeploy/create-release-action/compare/v3.0.1...v3.0.2) (2022-12-23)


### Bug Fixes

* Added release notes file back in, as trying to pass large data through action outputs isn't practical ([#367](https://github.com/OctopusDeploy/create-release-action/issues/367)) ([f4b624a](https://github.com/OctopusDeploy/create-release-action/commit/f4b624abdcf20d8e9decf6d743936c4e7570b909))

## [3.0.1](https://github.com/OctopusDeploy/create-release-action/compare/v3.0.0...v3.0.1) (2022-12-19)


### Bug Fixes

* updated dependencies ([9085cc2](https://github.com/OctopusDeploy/create-release-action/commit/9085cc2391362d4bd67cfd97ab069d882df376a2))

## [3.0.0](https://github.com/OctopusDeploy/create-release-action/compare/v2.1.0...v3.0.0) (2022-12-13)


### ⚠ BREAKING CHANGES

* Update action to use the native API client

### Features

* Update action to use the native API client ([982b7d4](https://github.com/OctopusDeploy/create-release-action/commit/982b7d4ab80a7c5f43aa38a90c9092c2b72768e8))


### Bug Fixes

* updated dependencies ([c10ca9e](https://github.com/OctopusDeploy/create-release-action/commit/c10ca9e5a3d9e030bba775cd474c54bbe0aab4e9))

## [2.1.0](https://github.com/OctopusDeploy/create-release-action/compare/v2.0.1...v2.1.0) (2022-11-03)


### Features

* bump dependencies ([6cdf8b5](https://github.com/OctopusDeploy/create-release-action/commit/6cdf8b5ae9cfe48342d45fbedfd55bf891d07b37))
* Update runner dependencies to Node 16 ([0ab7db0](https://github.com/OctopusDeploy/create-release-action/commit/0ab7db0303530a67fef95f709fbbbe50d182426d))

## [2.0.1](https://github.com/OctopusDeploy/create-release-action/compare/v2.0.0...v2.0.1) (2022-07-18)


### Bug Fixes

* Environment variables from the GitHub action context were not passed through to the underlying Octopus CLI ([d43577d](https://github.com/OctopusDeploy/create-release-action/commit/d43577d3aa0a92195c1b124a440e3e67eea3c2a7)), closes [#318](https://github.com/OctopusDeploy/create-release-action/issues/318)
* StdError and the process exit code returned by the CLI are now shown in Github Action runs ([d43577d](https://github.com/OctopusDeploy/create-release-action/commit/d43577d3aa0a92195c1b124a440e3e67eea3c2a7))

## [2.0.0](https://github.com/OctopusDeploy/create-release-action/compare/v1.2.0...v2.0.0) (2022-07-13)


### ⚠ BREAKING CHANGES

* The action now has an output release_number, which returns the Release Number assigned by the Octopus server. You can use this for future steps in your workflow if you would like to do additional things with the release.
* The action would previously ignore errors from the underlying Octopus CLI. These are now correctly reported through the action.
* Release 2.0

### Features

* Release 2.0 ([e04cfc9](https://github.com/OctopusDeploy/create-release-action/commit/e04cfc9bfa1472677ae0c4809e08c7db306b277f))
* The action now has an output release_number, which returns the Release Number assigned by the Octopus server. You can use this for future steps in your workflow if you would like to do additional things with the release. ([e04cfc9](https://github.com/OctopusDeploy/create-release-action/commit/e04cfc9bfa1472677ae0c4809e08c7db306b277f))
* The action now supports loading some options from environment variables: OCTOPUS_HOST, OCTOPUS_API_KEY, OCTOPUS_PROXY, OCTOPUS_PROXY_USERNAME, OCTOPUS_PROXY_PASSWORD, OCTOPUS_SPACE. Action inputs remain supported. ([e04cfc9](https://github.com/OctopusDeploy/create-release-action/commit/e04cfc9bfa1472677ae0c4809e08c7db306b277f))


### Bug Fixes

* The action would previously ignore errors from the underlying Octopus CLI. These are now correctly reported through the action. ([e04cfc9](https://github.com/OctopusDeploy/create-release-action/commit/e04cfc9bfa1472677ae0c4809e08c7db306b277f))

## [1.2.0](https://github.com/OctopusDeploy/create-release-action/compare/v1.1.4...v1.2.0) (2022-07-01)


### Features

* added multiple input support for tenants, tenant tags, and variables ([#260](https://github.com/OctopusDeploy/create-release-action/issues/260)) ([04615c8](https://github.com/OctopusDeploy/create-release-action/commit/04615c8854f754c0275e372a8d1be800de4bf13b))

## [1.1.4](https://github.com/OctopusDeploy/create-release-action/compare/v1.1.3...v1.1.4) (2022-06-28)


### Features

* Updated build pipeline ([#282](https://github.com/OctopusDeploy/create-release-action/issues/282)) ([80b6272](https://github.com/OctopusDeploy/create-release-action/commit/80b62723c789e9a7b4ca4b580f1b986540db0ce0))


### Bug Fixes

* updated README ([63d0581](https://github.com/OctopusDeploy/create-release-action/commit/63d0581c16acc09da66beaab126def241fccb78e))


### Miscellaneous Chores

* release 1.1.4 ([f2bcab1](https://github.com/OctopusDeploy/create-release-action/commit/f2bcab125425aedae05db3dffff986d3c07a5b15))

### [1.1.3](https://github.com/OctopusDeploy/create-release-action/compare/v1.1.2...v1.1.3) (2022-05-04)


### Bug Fixes

* updated deprecation message to fix typo ([18bd3d3](https://github.com/OctopusDeploy/create-release-action/commit/18bd3d3ee699201cb48b0a154f1eee2f7ef021b6))
* updated reference ([75d67a3](https://github.com/OctopusDeploy/create-release-action/commit/75d67a3d3f26a730ed3c00bbd75b17ec5b7fca65))

### [1.1.2](https://www.github.com/OctopusDeploy/create-release-action/compare/v1.1.1...v1.1.2) (2022-02-28)


### Bug Fixes

* --guidedFailure flag set to 'false' is evaluated as boolean true ([789ffc8](https://www.github.com/OctopusDeploy/create-release-action/commit/789ffc8a64b20656d5d9e2b71a4db71bec9f2c35))

### [1.1.1](https://www.github.com/OctopusDeploy/create-release-action/compare/v1.1.0...v1.1.1) (2021-09-17)


### Features

* updated tests ([505b877](https://www.github.com/OctopusDeploy/create-release-action/commit/505b8771e1b92a30399bdb73937d0ff7dbda4463))


### Bug Fixes

* trimmed input from multiline inputs ([282dd50](https://www.github.com/OctopusDeploy/create-release-action/commit/282dd509d9e5d0831e966113b091d2453bc0d979))


### Miscellaneous Chores

* release 1.1.1 ([fcaee1a](https://www.github.com/OctopusDeploy/create-release-action/commit/fcaee1a7a1e3678e31f0ee0e882ebd778edc1b0a))

## [1.1.0](https://www.github.com/OctopusDeploy/create-release-action/compare/v1.0.6...v1.1.0) (2021-09-15)


### Features

* added support for packages input ([2bf1c08](https://www.github.com/OctopusDeploy/create-release-action/commit/2bf1c08fb09d805750cbf74a2a3ad836bbfb3f41))


### Bug Fixes

* updated error handling ([3a1aa24](https://www.github.com/OctopusDeploy/create-release-action/commit/3a1aa24196373d8f88fa3db7004286fd3d90a7ab))

### [1.0.6](https://www.github.com/OctopusDeploy/create-release-action/compare/v1.0.4...v1.0.6) (2021-08-12)


### Bug Fixes

* updated tests to return valid results ([3172be8](https://www.github.com/OctopusDeploy/create-release-action/commit/3172be8ee824441609c02b674b99276c33c39068))


### Miscellaneous Chores

* release 1.0.5 ([ab2c22b](https://www.github.com/OctopusDeploy/create-release-action/commit/ab2c22b1d7aa78dffe981b43b1db6e0fd623ae3c))
* release 1.0.5 ([7bb274b](https://www.github.com/OctopusDeploy/create-release-action/commit/7bb274b32b00848e4013dd2a733f4e0cb24b000e))
* release 1.0.6 ([b9e4096](https://www.github.com/OctopusDeploy/create-release-action/commit/b9e4096ba3d632846c338efa47e9a49a8d337400))

### [1.0.4](https://www.github.com/OctopusDeploy/create-release-action/compare/v1.0.3...v1.0.4) (2021-07-21)


### Bug Fixes

* updated input variables ([c38c573](https://www.github.com/OctopusDeploy/create-release-action/commit/c38c573ec27f92eda0576452f2a4e12c08552f35))

### [1.0.3](https://www.github.com/OctopusDeploy/create-release-action/compare/v1.0.2...v1.0.3) (2021-07-16)


### Bug Fixes

* added tmp for tests ([969a126](https://www.github.com/OctopusDeploy/create-release-action/commit/969a12617ec16835a03bef2fcf7ff62ab1e8e4a0))
* bumped dependencies ([f46273a](https://www.github.com/OctopusDeploy/create-release-action/commit/f46273ad93992e6ad816d8c80d2347f4fdc0a890))
* bumped dependencies ([0ec53f9](https://www.github.com/OctopusDeploy/create-release-action/commit/0ec53f9960921f5eca2a7e108131dc47b22b9333))
* updated tests ([3f36961](https://www.github.com/OctopusDeploy/create-release-action/commit/3f3696157f39e455a3b73393ed5122e44cce6932))
* updated workflow order ([cbe8aa5](https://www.github.com/OctopusDeploy/create-release-action/commit/cbe8aa56beb2ab954eaf193a3199694ff77fefc9))

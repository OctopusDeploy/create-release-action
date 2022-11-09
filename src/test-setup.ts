import { dirSync, setGracefulCleanup } from 'tmp'

setGracefulCleanup()
const tmpdir = dirSync({ template: 'create-release-XXXXXX' })

process.env = Object.assign(process.env, {
  GITHUB_ACTION: '1',
  INPUT_API_KEY: process.env['OCTOPUS_API_KEY'],
  INPUT_DEBUG: false,
  INPUT_DEFAULT_PACKAGE_VERSION: false,
  INPUT_IGNORE_CHANNEL_RULES: false,
  INPUT_IGNORE_EXISTING: false,
  INPUT_PACKAGES: ' foo:1.2.3-quux \n bar:4.5.6-xyzzy \n ',
  INPUT_PROJECT: 'Projects-7341',
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name
})

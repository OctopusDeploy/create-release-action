import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'create-release-XXXXXX'})

process.env = Object.assign(process.env, {
  INPUT_API_KEY: process.env['OCTOPUS_APIKEY'],
  INPUT_CANCEL_ON_TIMEOUT: false,
  INPUT_DEBUG: false,
  INPUT_DEFAULT_PACKAGE_VERSION: false,
  INPUT_FORCE: false,
  INPUT_FORCE_PACKAGE_DOWNLOAD: false,
  INPUT_IGNORE_CHANNEL_RULES: false,
  INPUT_IGNORE_EXISTING: false,
  INPUT_IGNORE_SSL_ERRORS: false,
  INPUT_NO_RAW_LOG: false,
  INPUT_PROGRESS: false,
  INPUT_WAIT_FOR_DEPLOYMENT: false,
  INPUT_WHAT_IF: false,
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_PROJECT: 'Projects-7341',
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1'
})

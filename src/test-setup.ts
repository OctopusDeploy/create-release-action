import { dirSync, setGracefulCleanup } from 'tmp'

setGracefulCleanup()
const tmpdir = dirSync({ template: 'create-release-XXXXXX' })

process.env = Object.assign(process.env, {
  GITHUB_ACTION: '1',
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
  INPUT_PACKAGES: ' foo:1.2.3-quux \n bar:4.5.6-xyzzy \n ',
  INPUT_PROGRESS: false,
  INPUT_PROJECT: 'Projects-7341',
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_TENANTS: ' Tenants-123    \n Tenants-321 \n ',
  INPUT_TENANT_TAGS: '   TenantTags-123 \n  TenantTags-321 ',
  INPUT_VARIABLES: '   Variables-123 \n Variables-321 \n ',
  INPUT_WAIT_FOR_DEPLOYMENT: false,
  INPUT_WHAT_IF: false,
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name
})

import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'create-release-XXXXXX'})

process.env = Object.assign(process.env, {
  INPUT_API_KEY: process.env['OCTOPUS_APIKEY'],
  INPUT_SERVER: process.env['OCTOPUS_URL'],
  INPUT_PROJECT: 'Projects-6904',
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1'
})

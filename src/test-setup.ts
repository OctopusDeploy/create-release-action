import * as tmp from 'tmp'

tmp.setGracefulCleanup()
const tmpdir = tmp.dirSync({template: 'create-release-XXXXXX'})
process.env = Object.assign(process.env, {
  RUNNER_TEMP: tmpdir.name,
  RUNNER_TOOL_CACHE: tmpdir.name,
  GITHUB_ACTION: '1'
})

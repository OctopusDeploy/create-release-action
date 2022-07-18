import { pickupConfigurationValue, pickupConfigurationValueExtended } from '../../src/cli-util'
import { CaptureOutput } from '../test-helpers'

describe('pickupConfigurationValueExtended', () => {
  let output: CaptureOutput
  let values: any[]
  beforeEach(() => {
    output = new CaptureOutput()
    values = []
  })

  test('pickup from input', () => {
    pickupConfigurationValueExtended(output, {}, 'VALUE FromInput', '', '', v => values.push(v))

    expect(values).toEqual(['VALUE FromInput'])

    expect(output.getAllMessages()).toEqual([]) // no messages so we don't need to disambiguate types
  })

  test('pickup from env', () => {
    pickupConfigurationValueExtended(
      output,
      { ENV_VAR_NAME: 'VALUE FromEnv' },
      '',
      'OLD_ENV_VAR_NAME',
      'ENV_VAR_NAME',
      v => values.push(v)
    )

    expect(values).toEqual(['VALUE FromEnv'])

    expect(output.getAllMessages()).toEqual([]) // no messages so we don't need to disambiguate types
  })

  test('pickup from deprecated env', () => {
    pickupConfigurationValueExtended(
      output,
      { OLD_ENV_VAR_NAME: 'VALUE FromDeprecatedEnv' },
      '',
      'OLD_ENV_VAR_NAME',
      'ENV_VAR_NAME',
      v => values.push(v)
    )

    expect(values).toEqual(['VALUE FromDeprecatedEnv'])

    expect(output.infos).toEqual([]) // no messages so we don't need to disambiguate types
    expect(output.warns).toEqual(['Detected Deprecated OLD_ENV_VAR_NAME environment variable. Prefer ENV_VAR_NAME'])
  })

  test('input wins over env', () => {
    pickupConfigurationValueExtended(
      output,
      { ENV_VAR_NAME: 'VALUE FromEnv' },
      'VALUE FromInput',
      'OLD_ENV_VAR_NAME',
      'ENV_VAR_NAME',
      v => values.push(v)
    )

    expect(values).toEqual(['VALUE FromInput'])

    expect(output.infos).toEqual([]) // no messages so we don't need to disambiguate types
    expect(output.warns).toEqual([])
  })

  test('env wins over deprecated env', () => {
    pickupConfigurationValueExtended(
      output,
      { ENV_VAR_NAME: 'VALUE FromEnv', OLD_ENV_VAR_NAME: 'VALUE FromDeprecatedEnv' },
      '',
      'OLD_ENV_VAR_NAME',
      'ENV_VAR_NAME',
      v => values.push(v)
    )

    expect(values).toEqual(['VALUE FromEnv'])

    expect(output.infos).toEqual([]) // no messages so we don't need to disambiguate types
    expect(output.warns).toEqual(['Detected Deprecated OLD_ENV_VAR_NAME environment variable. Prefer ENV_VAR_NAME'])
  })

  test('input wins over deprecated env and still warns', () => {
    pickupConfigurationValueExtended(
      output,
      { ENV_VAR_NAME: 'VALUE FromEnv', OLD_ENV_VAR_NAME: 'VALUE FromDeprecatedEnv' },
      'VALUE FromInput',
      'OLD_ENV_VAR_NAME',
      'ENV_VAR_NAME',
      v => values.push(v)
    )

    expect(values).toEqual(['VALUE FromInput'])

    expect(output.infos).toEqual([]) // no messages so we don't need to disambiguate types
    expect(output.warns).toEqual(['Detected Deprecated OLD_ENV_VAR_NAME environment variable. Prefer ENV_VAR_NAME'])
  })
})

describe('pickupConfigurationValue', () => {
  let values: any[]
  beforeEach(() => {
    values = []
  })

  test('pickup from input', () => {
    pickupConfigurationValue({}, 'VALUE FromInput', '', v => values.push(v))

    expect(values).toEqual(['VALUE FromInput'])
  })

  test('pickup from env', () => {
    pickupConfigurationValue({ ENV_VAR_NAME: 'VALUE FromEnv' }, '', 'ENV_VAR_NAME', v => values.push(v))

    expect(values).toEqual(['VALUE FromEnv'])
  })

  test('input wins over env', () => {
    pickupConfigurationValue({ ENV_VAR_NAME: 'VALUE FromEnv' }, 'VALUE FromInput', 'ENV_VAR_NAME', v => values.push(v))

    expect(values).toEqual(['VALUE FromInput'])
  })
})

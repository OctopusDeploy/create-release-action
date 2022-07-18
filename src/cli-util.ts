// Things in this file are shared across more than one of our github actions; set up
// for easy copy-paste transfer across repos

export interface CliOutput {
  info: (message: string) => void
  warn: (message: string) => void
}

// When launching the Octopus CLI, we use a combination of environment variables and command line
// arguments. This interface carries them
export interface CliLaunchConfiguration {
  args: string[]
  env: { [key: string]: string }
}

// environment variables can either be a NodeJS.ProcessEnv or a plain old object with string keys/values for testing
export type EnvVars = { [key: string]: string } | NodeJS.ProcessEnv

// Picks up a config value from GHA Input or environment, supports mapping
// of an obsolete env var to a newer one (e.g. OCTOPUS_CLI_SERVER vs OCTOPUS_HOST)
export function pickupConfigurationValueExtended(
  output: CliOutput,
  env: EnvVars,
  valueFromInputParameters: string,
  inputObsoleteEnvKey: string,
  inputNewEnvKey: string,
  valueHandler: (value: string) => void
): void {
  // we always want to log the warning for a deprecated environment variable, even if the parameter comes in via inputParameter
  let result: string | undefined

  const deprecatedValue = env[inputObsoleteEnvKey]
  if (deprecatedValue && deprecatedValue.length > 0) {
    output.warn(`Detected Deprecated ${inputObsoleteEnvKey} environment variable. Prefer ${inputNewEnvKey}`)
    result = deprecatedValue
  }
  const value = env[inputNewEnvKey]
  // deliberately not 'else if' because if both OCTOPUS_CLI_API_KEY and OCTOPUS_API_KEY are set we want the latter to win
  if (value && value.length > 0) {
    result = value
  }
  if (valueFromInputParameters.length > 0) {
    result = valueFromInputParameters
  }
  if (result) {
    valueHandler(result)
  }
}

// Picks up a config value from GHA Input or environment
export function pickupConfigurationValue(
  env: EnvVars,
  valueFromInputParameters: string,
  inputNewEnvKey: string,
  valueHandler: (value: string) => void
): void {
  if (valueFromInputParameters.length > 0) {
    valueHandler(valueFromInputParameters)
  } else {
    const value = env[inputNewEnvKey]
    if (value && value.length > 0) {
      valueHandler(value)
    }
  }
}

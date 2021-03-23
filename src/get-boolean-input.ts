/**
 * Gets the input value of the boolean type in the YAML specification.
 * The return value is also in boolean type.
 * ref: https://yaml.org/type/bool.html
 *
 * @param     name     name of the input to get
 * @returns   boolean
 */
export function getBooleanInput(name: string): boolean {
  const trueValue = [
    'true',
    'True',
    'TRUE',
    'yes',
    'Yes',
    'YES',
    'y',
    'Y',
    'on',
    'On',
    'ON'
  ]
  const falseValue = [
    'false',
    'False',
    'FALSE',
    'no',
    'No',
    'NO',
    'n',
    'N',
    'off',
    'Off',
    'OFF'
  ]
  const val: string = (
    process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || ''
  ).trim()
  if (trueValue.includes(val)) return true
  if (falseValue.includes(val)) return false
  return false
}

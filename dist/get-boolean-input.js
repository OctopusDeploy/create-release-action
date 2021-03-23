"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooleanInput = void 0;
/**
 * Gets the input value of the boolean type in the YAML specification.
 * The return value is also in boolean type.
 * ref: https://yaml.org/type/bool.html
 *
 * @param     name     name of the input to get
 * @returns   boolean
 */
function getBooleanInput(name) {
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
    ];
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
    ];
    const val = (process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '').trim();
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    return false;
}
exports.getBooleanInput = getBooleanInput;

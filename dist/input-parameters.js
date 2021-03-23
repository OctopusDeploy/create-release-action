"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const core = __importStar(require("@actions/core"));
const get_boolean_input_1 = require("./get-boolean-input");
function get() {
    return {
        apiKey: core.getInput('api_key'),
        cancelOnTimeout: get_boolean_input_1.getBooleanInput('cancel_on_timeout'),
        channel: core.getInput('channel'),
        configFile: core.getInput('config_file'),
        debug: get_boolean_input_1.getBooleanInput('debug'),
        defaultPackageVersion: get_boolean_input_1.getBooleanInput('default_package_version'),
        deployAt: core.getInput('deploy_at'),
        deployTo: core.getInput('deploy_to'),
        deploymentCheckSleepCycle: core.getInput('deployment_check_sleep_cycle'),
        deploymentTimeout: core.getInput('deployment_timeout'),
        excludeMachines: core.getInput('exclude_machines'),
        force: get_boolean_input_1.getBooleanInput('force'),
        forcePackageDownload: get_boolean_input_1.getBooleanInput('force_package_download'),
        guidedFailure: core.getInput('guided_failure'),
        ignoreChannelRules: get_boolean_input_1.getBooleanInput('ignore_channel_rules'),
        ignoreExisting: get_boolean_input_1.getBooleanInput('ignore_existing'),
        ignoreSslErrors: get_boolean_input_1.getBooleanInput('ignore_ssl_errors'),
        logLevel: core.getInput('log_level'),
        noDeployAfter: core.getInput('no_deploy_after'),
        noRawLog: get_boolean_input_1.getBooleanInput('no_raw_log'),
        package: core.getInput('package'),
        packagePrerelease: core.getInput('package_prerelease'),
        packageVersion: core.getInput('package_version'),
        packagesFolder: core.getInput('packages_folder'),
        password: core.getInput('password'),
        progress: get_boolean_input_1.getBooleanInput('progress'),
        project: core.getInput('project'),
        proxy: core.getInput('proxy'),
        proxyPassword: core.getInput('proxy_password'),
        proxyUsername: core.getInput('proxy_username'),
        rawLogFile: core.getInput('raw_log_file'),
        releaseNotes: core.getInput('release_notes'),
        releaseNotesFile: core.getInput('release_notes_file'),
        releaseNumber: core.getInput('release_number'),
        server: core.getInput('server'),
        skip: core.getInput('skip'),
        space: core.getInput('space'),
        specificMachines: core.getInput('specific_machines'),
        tenant: core.getInput('tenant'),
        tenantTag: core.getInput('tenant_tag'),
        timeout: core.getInput('timeout'),
        username: core.getInput('user'),
        variable: core.getInput('variable'),
        waitForDeployment: get_boolean_input_1.getBooleanInput('wait_for_deployment'),
        whatIf: get_boolean_input_1.getBooleanInput('what_if')
    };
}
exports.get = get;

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRelease = void 0;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
function getArgs(parameters) {
    core.info('🔣 Parsing inputs...');
    const args = ['create-release'];
    if (parameters.apiKey.length > 0)
        args.push(`--apiKey=${parameters.apiKey}`);
    if (parameters.cancelOnTimeout)
        args.push(`--cancelOnTimeout`);
    if (parameters.channel.length > 0)
        args.push(`--channel=${parameters.channel}`);
    if (parameters.configFile.length > 0)
        args.push(`--configFile=${parameters.configFile}`);
    if (parameters.debug)
        args.push(`--debug`);
    if (parameters.defaultPackageVersion)
        args.push(`--defaultPackageVersion`);
    if (parameters.deployAt.length > 0)
        args.push(`--deployAt=${parameters.deployAt}`);
    if (parameters.deployTo.length > 0)
        args.push(`--deployTo=${parameters.deployTo}`);
    if (parameters.deploymentCheckSleepCycle.length > 0 &&
        parameters.deploymentCheckSleepCycle !== `00:00:10`)
        args.push(`--deploymentCheckSleepCycle=${parameters.deploymentCheckSleepCycle}`);
    if (parameters.deploymentTimeout.length > 0 &&
        parameters.deploymentTimeout !== `00:00:10`)
        args.push(`--deploymentTimeout=${parameters.deploymentTimeout}`);
    if (parameters.excludeMachines.length > 0)
        args.push(`--excludeMachines=${parameters.excludeMachines}`);
    if (parameters.force)
        args.push(`--force`);
    if (parameters.forcePackageDownload)
        args.push(`--forcePackageDownload`);
    if (parameters.guidedFailure)
        args.push(`--guidedFailure=True`);
    if (parameters.ignoreChannelRules)
        args.push(`--ignoreChannelRules`);
    if (parameters.ignoreExisting)
        args.push(`--ignoreExisting`);
    if (parameters.ignoreSslErrors)
        args.push(`--ignoreSslErrors`);
    if (parameters.logLevel.length > 0 && parameters.logLevel !== `debug`)
        args.push(`--logLevel=${parameters.logLevel}`);
    if (parameters.noDeployAfter.length > 0)
        args.push(`--noDeployAfter=${parameters.noDeployAfter}`);
    if (parameters.noRawLog)
        args.push(`--noRawLog`);
    if (parameters.package.length > 0)
        args.push(`--package=${parameters.package}`);
    if (parameters.packagePrerelease.length > 0)
        args.push(`--packagePrerelease=${parameters.packagePrerelease}`);
    if (parameters.packageVersion.length > 0)
        args.push(`--packageVersion=${parameters.packageVersion}`);
    if (parameters.packagesFolder.length > 0)
        args.push(`--packagesFolder=${parameters.packagesFolder}`);
    if (parameters.password.length > 0)
        args.push(`--pass=${parameters.password}`);
    if (parameters.progress)
        args.push(`--progress`);
    if (parameters.project.length > 0)
        args.push(`--project=${parameters.project}`);
    if (parameters.proxy.length > 0)
        args.push(`--proxy=${parameters.proxy}`);
    if (parameters.proxyPassword.length > 0)
        args.push(`--proxyPass=${parameters.proxyPassword}`);
    if (parameters.proxyUsername.length > 0)
        args.push(`--proxyUser=${parameters.proxyUsername}`);
    if (parameters.rawLogFile.length > 0)
        args.push(`--rawLogFile=${parameters.rawLogFile}`);
    if (parameters.releaseNotes.length > 0)
        args.push(`--releaseNotes=${parameters.releaseNotes}`);
    if (parameters.releaseNotesFile.length > 0)
        args.push(`--releaseNotesFile=${parameters.releaseNotesFile}`);
    if (parameters.releaseNumber.length > 0)
        args.push(`--releaseNumber=${parameters.releaseNumber}`);
    if (parameters.server.length > 0)
        args.push(`--server=${parameters.server}`);
    if (parameters.skip.length > 0)
        args.push(`--skip=${parameters.skip}`);
    if (parameters.space.length > 0)
        args.push(`--space=${parameters.space}`);
    if (parameters.specificMachines.length > 0)
        args.push(`--specificMachines=${parameters.specificMachines}`);
    if (parameters.tenant.length > 0)
        args.push(`--tenant=${parameters.tenant}`);
    if (parameters.tenantTag.length > 0)
        args.push(`--tenantTag=${parameters.tenantTag}`);
    if (parameters.logLevel.length > 0 && parameters.logLevel !== `600`)
        args.push(`--timeout=${parameters.timeout}`);
    if (parameters.username.length > 0)
        args.push(`--user=${parameters.username}`);
    if (parameters.variable.length > 0)
        args.push(`--variable=${parameters.variable}`);
    if (parameters.waitForDeployment)
        args.push(`--waitForDeployment`);
    if (parameters.whatIf)
        args.push(`--whatIf`);
    return args;
}
function createRelease(parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = getArgs(parameters);
        const options = {
            listeners: {
                stdline: (data) => {
                    if (data.length > 0) {
                        core.info(`${data}`);
                    }
                }
            },
            silent: true
        };
        core.info('🐙 Creating a release in Octopus...');
        yield exec.exec('octo', args, options);
    });
}
exports.createRelease = createRelease;

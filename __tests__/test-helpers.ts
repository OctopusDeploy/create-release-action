import { CliOutput } from '../src/cli-util'

export class CaptureOutput implements CliOutput {
  infos: string[]
  warns: string[]

  constructor() {
    this.infos = []
    this.warns = []
  }

  info(message: string) {
    this.infos.push(message)
  }
  warn(message: string) {
    this.warns.push(message)
  }

  getAllMessages(): string[] {
    return this.infos.concat(this.warns)
  }
}

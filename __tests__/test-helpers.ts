export class CaptureOutput {
  msgs: string[]

  constructor() {
    this.msgs = []
  }

  debug(message: string) {
    this.msgs.push('[DEBUG] ' + message)
  }
  info(message: string) {
    this.msgs.push('[INFO] ' + message)
  }
  warn(message: string) {
    this.msgs.push('[WARN] ' + message)
  }
  error(message: string) {
    this.msgs.push('[ERROR] ' + message)
  }

  getAllMessages(): string[] {
    return this.msgs
  }
}

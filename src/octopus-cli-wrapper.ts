export class OctopusCliWrapper {
  logInfo: (message: string) => void

  constructor(logInfo: (message: string) => void) {
    this.logInfo = logInfo
  }

  processLine(line: string) {
    if (line.length === 0) {
      return
    }

    if (line.includes('Octopus Deploy Command Line Tool')) {
      const version = line.split('version ')[1]
      this.logInfo(`🐙 Using Octopus Deploy CLI ${version}...`)
      return
    }

    if (line.includes('Handshaking with Octopus Server')) {
      this.logInfo(`🤝 Handshaking with Octopus Deploy`)
      return
    }

    if (line.includes('Authenticated as:')) {
      this.logInfo(`✅ Authenticated`)
      return
    }

    if (line.includes(' created successfully!')) {
      this.logInfo(`🎉 ${line}`)
      return
    }

    switch (line) {
      case 'Creating release...':
        this.logInfo('🐙 Creating a release in Octopus Deploy...')
        break
      default:
        this.logInfo(`${line}`)
        break
    }
  }
}

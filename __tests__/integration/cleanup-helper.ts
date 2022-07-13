type Callback = () => unknown

export class CleanupHelper {
  #actions: Callback[] = []

  add(callback: Callback) {
    this.#actions.push(callback)
  }

  async cleanup(): Promise<void> {
    // FIFO cleanup is the whole point of this class; test setup data is almost
    // always hierarchial where we create the parent, then attach a child to it,
    // requiring that we delete the child before the parent when cleaning up.
    const toExecute = [...this.#actions]
    toExecute.reverse()
    this.#actions = []

    for (let a of toExecute) {
      try {
        const result = a()
        if (result && typeof result === 'object') {
          const resultObj: any = result
          if (typeof resultObj?.then === 'function') {
            // it's a promise!
            await resultObj
          }
        }
      } catch (e: unknown) {
        console.error(`ERROR DURING CLEANUP!\n${e}`)
        // rethrow; ideally we should kill the process here once the stack unwinds.
        // a failure during cleanup leaves the system in an undefined state.
        // all bets are off so we should just abort rather than making it worse
        throw e
      }
    }
    // if a cleanup added more cleanups, the second phase wouldn't run; that doesn't make sense anyway
  }
}

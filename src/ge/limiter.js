export default class GERateLimiter {
  constructor(interval) {
    this.interval = interval
    this.availableAfter = Date.now() - 1
  }

  get availableIn() {
    return this.availableAfter - Date.now()
  }

  get canRequest() {
    return this.availableIn() <= 0
  }

  nextTick(cb) {
    setTimeout(() => {
      this.availableAfter = Date.now() + this.interval
      cb()
    }, Math.max(0, this.availableIn))
  }
}

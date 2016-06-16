import { createConnection } from './rabbitmq'

export default class MessageListener {
  constructor({ target, prefetch = 0 }) {
    this.target = target
    this.prefetch = prefetch
    this.messageHandler = null
  }

  setMessageHandler(fn) {
    this.messageHandler = fn
    return this
  }

  start() {
    let opts = { prefetch: this.prefetch }
    return createConnection(this.target, 'WORKER', opts)
      .then(sub => {
        // In the context of this application, a packet is a serialized JSON
        // string containing relevant job data for the consumer of the queue.
        sub.on('data', (packet) => {
          let message = JSON.parse(packet)
          this.messageHandler(message, () => sub.ack())
        })
      })
  }

  static listenTo(target) {
    return new MessageListener({ target })
  }

  static listenLinearly(target) {
    return new MessageListener({ target, prefetch: 1 })
  }
}

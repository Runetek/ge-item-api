import { createConnection } from './rabbitmq'

export default class MessageProducer {
  constructor(target) {
    this.target = target
    this.sock = null
  }

  emit(message) {
    this.sock.write(JSON.stringify(message))
  }

  start() {
    return createConnection(this.target, 'PUSH')
      .then(sock => {
        this.sock = sock
      })
      .then(() => this)
  }

  static forQueue(target) {
    return new MessageProducer(target)
  }
}

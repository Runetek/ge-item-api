const url = require('url')
import { createContext } from 'rabbit.js'

const connectionUri = url.parse(
  process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost'
)

export function createConnection(target, type, opts = {}) {
  return new Promise((resolve, reject) => {
    const ctx = createContext(url.format(connectionUri))
    ctx.on('ready', () => {
      let sock = ctx.socket(type, opts)
      sock.connect(target, () => resolve(sock))
    })
  })
}

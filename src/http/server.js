import * as routes from './routes'

const Hapi = require('hapi')
const Good = require('good')

const server = new Hapi.Server()
server.connection({
  port: 8080,
  host: 'localhost',
  labels: ['api'],
  routes: {
    cache: { privacy: 'public', expiresAt: '00:00' },
    cors: { origin: [ 'https://*.runetek.io' ] }
  }
})

server.route({
  method: 'GET',
  path: '/api/item-prices/bulk',
  config: routes.bulkItemPriceLookup
})

server.route({
  method: 'GET',
  path: '/api/item-prices/{itemId}',
  config: routes.singleItemPriceLookup
})

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

  if (err) {
    throw err // something bad happened loading the plugin
  }

  server.start((err) => {

    if (err) {
      throw err
    }
    server.log('info', 'Server running at: ' + server.info.uri)
  })
})

import Bus from '../bus'
import { Models } from '../model'
import Lookups from '../ge/lookup'
import GERateLimiter from '../ge/limiter'

const pluckMostRecentPrice = (prices, type) => prices.filter(p => p.type === type).sort(p => p.timestamp)[0].price
const transformItemPrice = (price) => Object.assign({}, price, { timestamp: new Date(price.timestamp) })

export const createItemGraphListener = () => {
  const apiLimit = new GERateLimiter(5000)

  Bus.MessageListener.listenLinearly('itemdb:item-graph')
    .setMessageHandler((message, ack) => {
      let { id, name, members } = message

      Lookups.itemGraph(id).then(prices => {
        prices = prices.map(transformItemPrice)

        Models.ItemPrice.findById(id).then(item => {
          if (! item) {
            item = new Models.ItemPrice({ itemId: id, name, members })
          }

          item.prices = prices
          item.updatedAt = Date.now()
          item.latestPrice = {
            daily: pluckMostRecentPrice(prices, 'daily'),
            average: pluckMostRecentPrice(prices, 'average')
          }

          item.save((err, raw) => {
            if (err) {
              return console.error(err)
            }

            apiLimit.nextTick(() => ack())
          })
        }).catch(console.error.bind(console))
      }).catch(console.error.bind(console))
    })
    .start()
    .catch(console.error.bind(console))
}

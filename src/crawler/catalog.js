import * as _ from 'lodash'
import fetch from 'node-fetch'

import Bus from '../bus'
import GECatalogUtil from '../util'
import GERateLimiter from '../ge/limiter'

const ITEMS_PER_PAGE = 12

const pageCount = items => Math.ceil(items / ITEMS_PER_PAGE)
const generatePageNumbers = items => _.range(1, pageCount(items) + 1)
const transformCatalogIndex = ({ letter, items }) => {
  return {
    alpha: letter,
    itemCount: items,
    pages: generatePageNumbers(items)
  }
}

const crawlPages = () => {
  return fetch('http://services.runescape.com/m=itemdb_oldschool/api/catalogue/category.json?category=1')
    .then(response => response.json())
    .then(response => response.alpha.map(transformCatalogIndex))
}

export const createCatalogCrawler = () => {
  Bus.MessageProducer.forQueue('itemdb:page')
    .start()
    .then(queue => {
      crawlPages().then(catalogGroups => {
        catalogGroups.forEach(({ alpha, pages }) => {
          pages.forEach(page => queue.emit({ alpha, page }))
        })
      })
    })
    .catch(console.error.bind(console))
}

const transformItem = item => {
  let { id, name, members, current } = item
  return { id, name, members: members === 'true', price: current.price }
}

export const createCatalogPageCrawler = () => {
  let apiLimit = new GERateLimiter(3000)

  let itemGraphQueue = Bus.MessageProducer.forQueue('itemdb:item-graph')
  let pageQueue = Bus.MessageListener.listenLinearly('itemdb:page')
    .setMessageHandler((message, ack) => {
      let { alpha, page } = message
      console.log(alpha, page, GECatalogUtil.getPageURL(alpha, page))

      fetch(GECatalogUtil.getPageURL(alpha, page))
        .then(response => response.json())
        .then(response => response.items.map(transformItem))
        .then(items => {
          items.forEach(item => itemGraphQueue.emit(item))

          // wait until the minimum time between requests has been hit before
          // ack'ing the message and continuing to the next message.
          apiLimit.nextTick(() => ack())
        })
        .catch(console.error.bind(console))
    })

    // make sure the item graph queue has been opened properly prior to
    // starting the page queue listener
    itemGraphQueue.start()
      .then(() => pageQueue.start())
}

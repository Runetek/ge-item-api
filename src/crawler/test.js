import Bus from '../bus'
import { createCatalogCrawler, createCatalogPageCrawler } from './catalog'
import { createItemGraphListener } from './item-graph'

createItemGraphListener()
createCatalogPageCrawler()
createCatalogCrawler()

// Bus.MessageListener.listenLinearly('itemdb:page')
//   .setMessageHandler((message, ack) => {
//     console.log('page', message)
//     setTimeout(() => ack(), 50)
//   })
//   .start()
//   .then(() => createCatalogCrawler())
//   .catch(console.error.bind(console))

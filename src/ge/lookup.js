const _ = require('lodash')
const fetch = require('node-fetch')

const aggregatePrices = (data, type) => _.map(data[type], (price, timestamp) => ({ type, timestamp: +timestamp, price }))

const formatUrl = (itemId) => ('http://services.runescape.com/m=itemdb_oldschool/api/graph/' + itemId + '.json')

const Lookups = {
  itemGraph: (itemId) => {
    return fetch(formatUrl(itemId))
      .then(response => response.json())
      .then(data => aggregatePrices(data, 'daily').concat(aggregatePrices(data, 'average')))
  }
}

export default Lookups

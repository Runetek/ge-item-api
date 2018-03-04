import mongoose from 'mongoose'

// replace deprecated 'mpromises' usage
mongoose.Promise = global.Promise

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost'
mongoose.connect(mongodbUri + '/itemprices')

const itemPriceSchema = mongoose.Schema({
  itemId: { $type: Number, index: { unique: true } },
  name: { $type: String, text: true },
  members: Boolean,
  latestPrice: { daily: Number, average: Number },
  prices: [{ price: Number, timestamp: Date, type: String }]
}, {
  timestamps: true,
  typeKey: '$type'
})

itemPriceSchema.statics.findById = function (itemId) {
  return this.model('ItemPrice', itemPriceSchema)
    .find({ itemId })
    .select({ itemId: 1, name: 1, members: 1, latestPrice: 1, updatedAt: 1 })
    .exec()
    .then(items => items[0])
}

const ItemPrice = mongoose.model('ItemPrice', itemPriceSchema)

export const Models = {
  ItemPrice
}

const serializeItemPrice = item => ({
  id: item.itemId,
  name: item.name,
  members: item.members,
  latestPrice: item.latestPrice,
  updated_at: item.updatedAt
})

const serializeItemPrices = items => items.map(serializeItemPrice)

export const Serializers = {
  itemPrice: serializeItemPrice,
  itemPrices: serializeItemPrices
}


import url from 'url'

const OSRS_GE_URL = 'http://services.runescape.com/m=itemdb_oldschool/api/catalogue/items.json'

const OSRS_GE_STRUCT = url.parse(OSRS_GE_URL, true)
OSRS_GE_STRUCT.search = null

export default class GECatalogUtil {
  static getPageURL(alpha, page) {
    const clone = Object.assign({}, url.parse(OSRS_GE_URL, true), {
      query: Object.assign({}, { category: 1 }, { alpha, page })
    })
    return url.format(clone)
  }
}

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const DIR_COLLECTIONS = path.resolve(process.cwd(), 'src', 'collections')

module.exports = () => {
  const files = []
  const sha = crypto.createHash('sha1')

  if (!fs.existsSync(DIR_COLLECTIONS)) {
    return ''
  }

  fs.readdirSync(DIR_COLLECTIONS, { withFileTypes: true }).forEach(item => {
    if (item.isDirectory()) {
      const isReducerPresent = fs.existsSync(
        path.resolve(DIR_COLLECTIONS, item.name, 'reducer.js'),
      )

      const isSagaPresent = fs.existsSync(
        path.resolve(DIR_COLLECTIONS, item.name, 'saga.js'),
      )

      if (isReducerPresent) {
        files.push(['collections', item.name, 'reducer.js'].join('/'))
      }

      if (isSagaPresent) {
        files.push(['collections', item.name, 'saga.js'].join('/'))
      }
    }
  })

  const flatStructure = files.sort().join(':')

  sha.update(flatStructure)

  return sha.digest('base64')
}

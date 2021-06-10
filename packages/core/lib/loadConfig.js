const path = require('path')
const { DIST_DIR_NAME } = require('./constants')

module.exports = async () => {
  return {
    future: {
      // It must be a default value because nextjs in our setup always uses webpack5
      webpack5: true,
    },

    distDir: DIST_DIR_NAME,

    reactStrictMode: true,
  }
}

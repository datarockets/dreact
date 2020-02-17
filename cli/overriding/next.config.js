const path = require('path')

const CWD = process.cwd()

module.exports = {
  distDir: '../.next',

  useFileSystemPublicRoutes: false,

  webpack: (config, { isServer }) => {
    config.resolve.alias['react'] = getClientDependency('react')
    config.resolve.alias['react-dom'] = getClientDependency('react-dom')

    return config
  },

  exportPathMap: async () => {
    return {
      '/': { page: 'Home' },
    }
  },
}

function getClientDependency(name) {
  return path.resolve(CWD, 'node_modules', name)
}

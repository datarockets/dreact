const path = require('path')

const CWD = process.cwd()

module.exports = {
  distDir: '../.next',

  useFileSystemPublicRoutes: false,

  webpack: (config, { isServer }) => {
    // console.log(isServer)
    // console.log(config)

    // console.log('a')

    // if (!isServer) {
    config.resolve.alias['react'] = getClientDependency('react')
    config.resolve.alias['react-dom'] = getClientDependency('react-dom')
    // }

    return config
  },

  experimental: {
    cpus: 1,
    workerThreads: 1,
  },
}

function getClientDependency(name) {
  return path.resolve(CWD, 'node_modules', name)
}

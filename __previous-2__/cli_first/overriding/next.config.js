const path = require('path')

const CWD = process.cwd()

module.exports = {
  useFileSystemPublicRoutes: false,

  webpack: (config, { isServer }) => {
    // console.log(isServer)
    // console.log(config)

    // if (!isServer) {
    config.resolve.alias['react'] = getClientDependency('react')
    config.resolve.alias['react-dom'] = getClientDependency('react-dom')
    // }

    return config
  },
}

function getClientDependency(name) {
  return path.resolve(CWD, 'node_modules', name)
}

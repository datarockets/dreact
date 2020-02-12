const buildRoute = (pattern, page, policies) => {
  function route() {
    return pattern
  }

  route.pattern = pattern
  route.page = page

  return route
}

module.exports.to = {
  Home: buildRoute('/', '/', []),
  Another: buildRoute('/asd', '/test', []),
}

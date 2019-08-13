function createWrapperForAppInjectionToMimicRealWorld() {
  const rootElement = document.createElement('div')
  rootElement.id = 'root'
  document.body.appendChild(rootElement)
}

createWrapperForAppInjectionToMimicRealWorld()

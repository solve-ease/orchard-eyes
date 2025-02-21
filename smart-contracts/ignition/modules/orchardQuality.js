const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules')

const contractModule = buildModule('contractModule', (m) => {
  const OrchardQuality = m.contract('OrchardQuality')

  return { OrchardQuality }
})

module.exports = contractModule

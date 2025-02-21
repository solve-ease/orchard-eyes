// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with account:', deployer.address)

  const Contract = await ethers.getContractFactory('OrchardQuality')
  const contract = await Contract.deploy()
  await contract.deployed()

  console.log('Contract deployed to:', contract.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying contracts with account:', deployer.address)

  const Farm = await ethers.getContractFactory('Farm')
  const farm = await Farm.deploy()
  await farm.deployed()

  console.log('Contract deployed to:', farm.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

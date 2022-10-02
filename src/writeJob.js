const fs = require('fs').promises
const path = require('path')
const fetchBalance = require('./fetchBalance')
const gecko = require('./connections/geckoapi')
const balance = require(path.join('..','data','balance.json'))

module.exports = async (address)=>{
    const tokenBase = await gecko()
    const { ethBalance,tokenBalance } = await fetchBalance(address,tokenBase)
    const document = {
        nativeEthBalance:ethBalance,
        ERC20tokens:tokenBalance,
        createdAt:Date.now()
    }
    await fs.writeFile(path.join('data','balance.json'),JSON.stringify(document))
}

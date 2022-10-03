const fs = require('fs').promises
import path from "path";
const fetchBalance = require('./fetchBalance')
const gecko = require('./apis/geckoapi')

export default async (address:string)=>{
    const tokenBase = await gecko()
    const balance = await fetchBalance(address,tokenBase)
    const document = {
        balance:balance,
        createdAt:Date.now()
    }
    await fs.writeFile(path.join('data','balance.json'),JSON.stringify(document))
}

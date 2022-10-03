import path from "path";
const CoinGecko = require('coingecko-api');
const crawler = require('erc20-token-list')
// Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();
import { promises as fs } from 'fs'
//file where the token data is stored for convenience

module.exports = async (pages=20,rewrite=false)=>{
    let check;
    await fs.access(path.join('data','tokenbase.json')).then(()=>{
        check=true
    })
    if(!check || rewrite ) {
        console.log("Rewriting token base...")
        const coinList = new Map()
        const data = []
        //put together needed scope of pages
        for(let page = 0; page < pages; page++){
            const addPage:any = await CoinGeckoClient.coins.all({page:page})
            data.push(...Object.values(addPage.data).map(function(coin:any){return {name:coin.name,symbol:coin.symbol}}))
        }
        //get blockchain address for each token via API
        for (const coin of data) {
            const result = crawler.getTokenInfo(coin.symbol.toUpperCase())
            if (result) {
                coinList.set(coin.name, result.address)
            }
        }
        console.log(`Map of tokens with size ${coinList.size} created`)
        //write to tokenbase.json file for further reuse
        await fs.writeFile(path.join('data','tokenbase.json'),JSON.stringify(Object.fromEntries(coinList)))
        return coinList
    }
    else {
        const tokensfile = await fs.readFile(path.join('data','tokenbase.json'))
        const tokenBase = Object.entries(JSON.parse(tokensfile.toString()))
        return new Map(tokenBase)
    }
}
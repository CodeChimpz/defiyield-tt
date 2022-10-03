import path from "path";
const CoinGecko = require('coingecko-api');
const crawler = require('erc20-token-list')
// Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();
import fs from 'fs'
//file where the token data is stored for convenience

module.exports = async (pages=20,rewrite=false)=>{
    if(!fs.existsSync(path.join('data','tokenbase.json')) || rewrite ) {
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
                coinList.set(coin.symbol, result.address)
            }
        }
        console.log(`Map of tokens with size ${coinList.size} created`)
        //write to tokenbase.json file for further reuse
        await fs.promises.writeFile(path.join('data','tokenbase.json'),JSON.stringify(Object.fromEntries(coinList)))
        return coinList
    }
    else {
        const tokensfile = await fs.promises.readFile(path.join('data','tokenbase.json'))
        const tokenBase = Object.entries(JSON.parse(tokensfile.toString()))
        return new Map(tokenBase)
    }
}
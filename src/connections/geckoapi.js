const CoinGecko = require('coingecko-api');
const crawler = require('erc20-token-list')
// Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();
const fs = require('fs').promises
const path = require('path')
//file where the token data is stored for convenience
const tokensfile = require(path.join('..','..','data','tokenbase.json'))

module.exports = async (params={pages:4,rewrite:false})=>{
    const tokenBase = Object.entries(tokensfile)
    if(!tokenBase.length || params.rewrite ) {
        const coinList = new Map()
        const data = []
        //put together needed scope of pages
        const pages=params.pages
        for(let page = 0; page < pages; page++){
            const page = await CoinGeckoClient.coins.all({page:page})
            data.push(...Object.values(page.data).map(coin=>{return {name:coin.name,symbol:coin.symbol}}))
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
    else return new Map(tokenBase)
}
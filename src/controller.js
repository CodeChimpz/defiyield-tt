const fetchBalance = require('./fetchBalance')
const gecko = require('./connections/geckoapi')
const fs = require('fs').promises
const path = require('path')
const config = require(path.join('./','..','config.json'))
const balance = require(path.join('..','data','balance.json'))

module.exports = async (req,res,next)=>{
    try{
        //get map of erc20 tokens from CoinGeckoApi, passing the scope of search as a pages param
        const tokenBase = await gecko({pages:3})
        //if data for the address has already being logged, serve it straight from the file
        if(req.params.address === config.address){
            return res.status(200).json( balance )
        }
        //if not - fetch balance for an address sing the token map,
        //get ether native balance and all found tokens as results
        const {ethBalance,tokenBalance} = await fetchBalance(req.params.address,tokenBase)
        res.status(200).json({ ethBalance,tokenBalance })
    }catch(err){
        next(err)
    }
}

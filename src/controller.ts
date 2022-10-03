const fetchBalance = require('./fetchBalance')
const gecko = require('./apis/geckoapi')
import {promises as fs } from 'fs'
import path from "path";
const config = require(path.join('./','..','config.json'))
const router = require('express').Router()

export default async function (req:any,res:any,next:any){
    try{
        //get map of erc20 tokens from CoinGeckoApi, passing the scope of search as a pages param
        const tokenBase = await gecko()
        //if data for the address has already being logged, serve it straight from the file
        let check;
        await fs.access(path.join('data','balance.json')).then(()=>{
            check=true
        })
        if(req.params.address === config.address && check){
            console.log('balance exists in database: ',check)
            const balance = await fs.readFile(path.join('data','balance.json'))
            const balanceJson = JSON.parse(balance.toString())
            //check if date at which the file was created is not more than set update interval, other way - fetch from API
            const oldDate = new Date(balanceJson.createdAt)
            const dateDiff = (+Date.now() - +oldDate)/<number>config.interval
            if(dateDiff <= 1){
                balanceJson.createdAt = oldDate
                return res.status(200).json( {...balanceJson})
            }
        }
        //if not - fetch balance for an address sing the token map,
        //get ether native balance and all found tokens as results
        const result = await fetchBalance(req.params.address,tokenBase)
        result.createdAt = new Date(result.createdAt)
        return res.status(200).json( {...result})
    }catch(err){
        next(err)
    }
}

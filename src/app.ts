import path from 'path'
const app = require('express')()
const config = require(path.join('./','..','config.json'))
require('dotenv').config()

import controller from './controller'
app.get('/balance/:address',controller)

app.listen(process.env.PORT,()=>{
    console.log('Server started')
})

import writeJob  from './writeJob'
// Starting an async job
const inter = config.job_interval || 60*1000
const writer = (async function(interval:number){
    while(true){
        await (()=>{return new Promise(resolve => {
            setTimeout(async ()=>{
                await writeJob(config.address)
                resolve('written to balance')
            },interval)
        })})()
    }
})(inter)
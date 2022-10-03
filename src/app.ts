import path from 'path'
import { engine }  from 'express-handlebars'
const app = require('express')()
const config = require(path.join('./','..','config.json'))
require('dotenv').config()

//handlebars settings
app.engine('handlebars',engine())
app.set('view engine','handlebars')
app.set('views',path.join('views'))

import controller from './controller'
app.get('/balance/:address',controller)

app.listen(process.env.PORT,()=>{
    console.log('Server started')})

import writeJob  from './writeJob'
// Starting an async job
const inter =  <number> <unknown> process.env.INTERVAL || 60*1000
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
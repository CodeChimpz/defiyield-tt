const app = require('express')()
const path = require('path')

const config = require(path.join('./','..','config.json'))
require('dotenv').config()

const controller = require('./controller')
app.get('/balance/:address',controller)

app.listen(process.env.PORT,()=>{
    console.log('Server started')})

const writeJob  = require('./writeJob')
// Starting an async job
const writer = (async function(interval){
    while(true){
        await (()=>{return new Promise(resolve => {
            setTimeout(async ()=>{
                console.time('write')
                await writeJob(config.address)
                console.timeEnd('write')
            },interval)
        })})()
    }
})(60*1000)





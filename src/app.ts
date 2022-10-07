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
const inter = config.job_interval || 3*1000
// writeJob(config.address,inter)
import workers from 'worker_threads'
const write = ()=>{
    const worker = new workers.Worker('./src/writeJob',{
        workerData:{
            address:config.address,
            interval:inter
        }
    })
    worker.on("online",()=>{
        console.log("Job initialized")
    })
    worker.on("message",(msg)=>{
        console.log(msg)
    })
    worker.on("error",err=>{
        console.log(err)
    })
}
write()
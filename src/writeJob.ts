import {promises as fs} from 'fs'
import path from 'path'
import workers from 'worker_threads'

const fetchBalance = require('./fetchBalance')
const gecko = require('./apis/geckoapi')

const writer = async (address:string, interval:number)=> {
    const writer = {
        [Symbol.asyncIterator]() {
            return {
                async next() {
                    console.time('wait')
                    const result = await new Promise((resolve, reject) => setTimeout(() => {
                            (async () => {
                                console.timeEnd('wait')
                                try {
                                    console.time('write')
                                    const tokenBase = await gecko()
                                    const balance = await fetchBalance(address, tokenBase)
                                    const document = {
                                        balance: balance,
                                        createdAt: Date.now()
                                    }
                                    await fs.writeFile(path.join('data', 'balance.json'), JSON.stringify(document))
                                    console.timeEnd('write')
                                    resolve(0)
                                } catch (err) {
                                    console.log(err)
                                    reject(err)
                                }
                            })()
                        }, interval)
                    )
                    return {done: false, value: result}
                }
            }
        }
    }
    for await(let i of writer) {
        if (i) {
            return i
        } else workers.parentPort?.postMessage('Written to balance successfully ...'+Date())
    }
}

if(!workers.isMainThread){
    // workers.parentPort?.postMessage(workers.workerData)
    const {address,interval} = workers.workerData
        writer(address,interval).then((err)=>{
            throw err
        })
}

export default writer



const abi = require('human-standard-token-abi')
import web3 from './apis/web3'

module.exports = async (ethAddress:string,tokenBase:any)=>{
    try{
        //get native ether balance
        const ethBalance = web3.utils.fromWei(await web3.eth.getBalance(ethAddress),'ether')
        //for each entry on the token map, issue an API call to check if an address holds any of this token
        const tokenBalance = new Map()
        let token:string
        let address:string
        for ([token,address] of tokenBase){
            const contract = new web3.eth.Contract(abi,address)
            try{
                const balance = await contract.methods.balanceOf(ethAddress).call()
                if(balance != 0){
                    tokenBalance.set(token,web3.utils.fromWei(balance,'ether'))
                }
            }catch(err){
                console.log(token,':','failed')
            }
        }
        return {
            ethBalance,
            tokenBalance:Object.fromEntries(tokenBalance)
        }
    }catch(err){
        throw(err)
    }
}

const abi = require('human-standard-token-abi')
import web3 from './apis/web3'
import Balance from './model/Balance'

module.exports = async (ethAddress:string,tokenBase:any)=>{
    try{
        //get native ether balance
        const ethBalance = web3.utils.fromWei(await web3.eth.getBalance(ethAddress),'ether')
        //for each entry on the token map, issue an API call to check if an address holds any of this token
        const tokenBalance : Balance[] = []
        tokenBalance.push(new Balance('0x0000000000000000000000000000000000000000','ETH',ethBalance))
        let token:string
        let address:string
        for ([token,address] of tokenBase){
            const contract = new web3.eth.Contract(abi,address)
            try{
                const balance = await contract.methods.balanceOf(ethAddress).call()
                if(balance != 0){
                    //get token decimals and format balance in proper values
                    const decimals = await contract.methods.decimals().call();
                    const amount = balance/Math.pow(10,decimals)
                    tokenBalance.push(new Balance(address,token,amount.toString()))
                }
            }catch(err){
                console.log(token,':','failed')
            }
        }
        return {
            balance:tokenBalance
        }
    }catch(err){
        throw(err)
    }
}

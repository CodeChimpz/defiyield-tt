const abi = require('human-standard-token-abi')
const {eth,utils} = require('./connections/web3')

module.exports = async (address,tokenBase)=>{
    try{
        //get native ether balance
        const ethBalance = utils.fromWei(await eth.getBalance(address),'ether')
        //for each entry on the token map, issue an API call to check if an address holds any of this token
        const tokenBalance = {}
        let token
        for ([token,tokenAddress] of tokenBase){
            const contract = new eth.Contract(abi,tokenAddress)
            try{
                const balance = await contract.methods.balanceOf(address).call()
                if(balance != 0){
                    tokenBalance[token]=utils.fromWei(balance,'ether')
                }
            }catch(err){
                console.log(token,':','failed')
            }
        }
        return {
            ethBalance,
            tokenBalance
        }
    }catch(err){
        throw(err)
    }
    }

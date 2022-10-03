const Web3 = require('web3')
let web3Provider;
if(process.env.HTTP_PROVIDER){
    web3Provider=new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER)
}
else if(process.env.IPC_PROVIDER){
    web3Provider=new Web3.providers.IpcProvider(process.env.IPC_PROVIDER)
}
const web3 = new Web3(web3Provider)

export default web3
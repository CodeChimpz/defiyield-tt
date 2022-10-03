const Web3 = require('web3')
const web3Provider = new Web3.providers.HttpProvider(process.env.PROVIDER)
const web3 = new Web3(web3Provider)

export default web3
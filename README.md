# defiyield-tt-ethereum-balance
API for viewing ether and erc20 token balances

# Instructions for running
1. Install docker
2. Pull this repository
3. Set environmental valures in .env file :
**PROVIDER** (**HTTP_PROVIDER** being your blockchain node provider address OR
**IPC_PROVIDER** - your local blockchain node address)
4. run `docker build . -t eth-balance`
5. run `docker run -d -p (port):8080 --name eth-balance eth-balance`

# Instructions for running (manual)
1. Pull this repository
2. Prerequisites : Node.js 16.14.0, npm 8.3.1
3. Crete data folder in root directory
4. Run `npm install` in terminal , it will download node_nodules
5. Run `tsc` to compile TyeScript
6. Set environment variables **PORT** and **PROVIDER** (**HTTP_PROVIDER** being your blockchain node provider address OR
**IPC_PROVIDER** - your local blockchain node address)
6. Run via `node start`

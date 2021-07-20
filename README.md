# Voting

## Introduction

## Installation

The software is working under Linux and requires installation of basic Javascript tools (`node`, `npm`). From the project directory run command `npm install` to download dependencies automatically.

## Available Scripts

In the project directory, you can run (preferably in that order):

### `npm run compile`

Recompiles the Solidity contracts from _contracts_ directory.

### `npm run setup`

Launches the local Hardhat node with Ethereum blockchain. 

### `npm start`

Runs the React app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Runs test for contract functionality. (written using [https://www.chaijs.com/](Chai) and [https://www.npmjs.com/package/@openzeppelin/test-helpers](openzeppelin/test-helpers))


## TODO
 - styles
 - autogenerate names for the candidates
 - caching wallet (one-time login, cookie?)
 - separate deployer view & general component refactor (granularize)
 - auto-update of the component (event listeners?)
 - contract: research increaseAllowance method while open_envelope rather than _transfer while check_outcome
 - fetch contract abi (right now hardcoded into _fetchAbi.js_)


## Acknowledgements

 - Used [https://github.com/PiotrNap/YouTube-channel-source-code/tree/master/React-metamask-intro](piotrnap's app) as the base of the project. Many thanks to him and his youtube channel.
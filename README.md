# Voting project

## Introduction

The dapp utilizes the possibilities of web3 and Ethereum blockchain to run a simple platform for voting, implementing the requirements of the final project of P2P systems & blockchain course at University of Pisa. The repository contains the code of smart contract (SC) as well as webapp for its deployment and interaction.

## Description

The constructor of voting SC takes 3 parameters: # of participants for reaching the quorum, address of the escrow, and the list of candidates' addresses (separated w/ commas). After a successful deployment, the SC is available at localhost:3000/address_of_SC. Then, the SC owner can distibute ERC-20 tokens used for voting and begin the voting phase.

The participants of the voting declare the candidate and the amount of token, and cast the "enveloped" votes by sending their hash to SC. When the quorum is reached, each voter can open the envelope they previously cast to officially express their vote. A voter needs to provide the inputs previously used to compute the hash.

After all the envelopes are opened, the deployer can check for results of the voting. The candidate with the most tokens bet on, becomes a winner. All the tokens bet on him are burnt and the rest is returned to the voters. In case of the draw, all the bet tokens are transfered to the escrow address. 

## TODO
 - styles
 - generate or fetch names for the candidates
 - caching wallet (one-time login, cookie?)
 - separate deployer view & general component refactor (granularize)
 - auto-update of the component (event listeners?)
 - contract: research increaseAllowance method while open_envelope rather than _transfer while check_outcome
 - fetch contract abi? (right now hardcoded into _fetchAbi.js_)
 - jeez this whole voting system is crooked and abusable, needs a massive rework if supposed to work irl 

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
Open [localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Runs test for contract functionality. (written using [Chai](https://www.chaijs.com/) and [openzeppelin/test-helpers](https://www.npmjs.com/package/@openzeppelin/test-helpers))

## Acknowledgements

 - Used [piotrnap's app](https://github.com/PiotrNap/YouTube-channel-source-code/tree/master/React-metamask-intro) as the boilerplate. Many thanks to him and his youtube channel.

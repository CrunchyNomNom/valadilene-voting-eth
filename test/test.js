const { expect } = require('chai');
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const fs = require("fs");
const constants = require('@openzeppelin/test-helpers/src/constants');

const QUORUM = 3;

let cf, provider, deployer, accounts, ADDRESS_CONTRACT;

before(async () => {
    cf = JSON.parse(fs.readFileSync("./build/contracts/VoteSoul.sol/VoteSoul.json", "utf8"));
    provider = new ethers.providers.StaticJsonRpcProvider(
        'http://127.0.0.1:8545', { name: 'hardhat', chainId: 1337 }
    );
    accounts = await provider.listAccounts();
    deployer = provider.getSigner(accounts[0]);

    const factory = new ethers.ContractFactory(cf.abi, cf.bytecode, deployer);
    const contract = await factory.deploy(QUORUM, accounts[19], accounts.slice(16,19));
    await contract.deployed();
    ADDRESS_CONTRACT = contract.address;
    console.log("VoteSoul deployed to:", ADDRESS_CONTRACT);
});

describe('VoteSoul', function () {

    it('should show zero address balance', async function () {
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        expect(await contract.balanceOf(constants.ZERO_ADDRESS)).to.equal(0);
    });
    
    it('deployer should be able to mint', async function () {
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        const address = await deployer.getAddress();
        await expect(contract.mint(address, '' + 100))
            .to.emit(contract, 'Transfer')
            .withArgs(constants.ZERO_ADDRESS, address, 100);
    });

    it('others should not be able to mint', async function () {
        const signer = provider.getSigner(accounts[1]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        await expectRevert(contract.mint(deployer.getAddress(), '' + 100),
            "Only the contract deployer can use this function"
        );
    });

    it('deployer should not be able to begin the voting prematurely', async function () {
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        await expectRevert(contract.begin_voting(),
            "Inefficient voting participants to reach the quorum."
        );
    });

    it('deployer should be able to begin the voting after providing tokens to enough voters', async function () {
        const signer = provider.getSigner(accounts[1]);
        const signer2 = provider.getSigner(accounts[2]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        const mint = await contract.mint(signer.getAddress(), 100);
        const mint2 = await contract.mint(signer2.getAddress(), 100);
        await expect(contract.begin_voting())
            .to.emit(contract, 'LetTheVoteBegin');
    });

    it('voter should be able to vote', async function () {
        const signer = provider.getSigner(accounts[1]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        const envelope = await contract.compute_envelope(accounts[16], 17);
        console.log(JSON.stringify(envelope));
        await expect(contract.cast_envelope(envelope))
            .to.emit(contract, 'EnvelopeCast')
            .withArgs(() => signer.getAddress());
    });

    it('voter should be able to change his vote', async function () {
        const signer = provider.getSigner(accounts[1]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        const envelope = await contract.compute_envelope(accounts[16], 200);
        console.log(JSON.stringify(envelope));
        await expect(contract.cast_envelope(envelope))
            .to.emit(contract, 'EnvelopeCast');
    });

    it('voter should not be able to open his envelope before reaching quorum', async function () {
        const signer = provider.getSigner(accounts[1]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        await expectRevert(contract.open_envelope(accounts[16], 200),
            "Cannot open an envelope, voting quorum not reached yet"
        );
    });

    it('voter should be able to open his envelope after reaching quorum', async function () {
        const signer = provider.getSigner(accounts[2]);
        const contract1 = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        const envelope1 = await contract1.compute_envelope(constants.ZERO_ADDRESS, 0);
        const vote1 = await contract1.cast_envelope(envelope1);
        
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        const envelope = await contract.compute_envelope(accounts[17], 40);
        const vote = await contract.cast_envelope(envelope);

        await expect(contract.open_envelope(accounts[17], 40))
            .to.emit(contract, 'EnvelopeOpen')
            .withArgs(() => deployer.getAddress(), accounts[17], 40);
    });

    it('voter should not be able to open his envelope again', async function () {
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        await expectRevert(contract.open_envelope(accounts[17], 40),
            "The sender has no envelope to open"
        );
    });

    it('voter should be declined opening an envelope after providing false arguments', async function () {
        const signer = provider.getSigner(accounts[1]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        await expectRevert(contract.open_envelope(accounts[16], 17),    // using his "first" vote, if positive then overriding votes may not work
            "Sent envelope does not correspond to the one cast"
        );
    });

    it('voter should not be charged after having insufficient funds and his vote should not count', async function () {
        const signer = provider.getSigner(accounts[1]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        await expect(contract.open_envelope(accounts[16], 200))
            .to.emit(contract, 'EnvelopeOpenInvalid');
        await expect(await (contract.balanceOf(accounts[1]))).to.equal(100);
    });

    it('deployer should not be able to check for the winner before opening all the envelopes', async function () {
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        await expectRevert(contract.check_outcome(),
            "Cannot check the winner, need to open all the sent envelopes"
        );
    });

    it('voter should not be charged after voting on non-candidate address and his vote should not count', async function () {
        const signer = provider.getSigner(accounts[2]);
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, signer);
        await expect(contract.open_envelope(constants.ZERO_ADDRESS, 0))
            .to.emit(contract, 'EnvelopeOpenInvalid');
        await expect(await (contract.balanceOf(accounts[2]))).to.equal(100);
    });

    it('deployer should be able to check for the winner after opening all the envelopes', async function () {
        const contract = new ethers.Contract(ADDRESS_CONTRACT, cf.abi, deployer);
        await expect(contract.check_outcome())
            .to.emit(contract, 'NewMayor').withArgs(accounts[17]);
    });

    // test for the tie?
});

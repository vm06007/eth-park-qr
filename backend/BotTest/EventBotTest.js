const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('YOUR_PROVIDER_URL');

const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const abi = [
    "event EventTest(address indexed sender, uint256 indexed value)",
    "function changeStorage(uint256 _value) external",
];

const privateKey = 'YOUR_PRIVATE_KEY';

const wallet = new ethers.Wallet(privateKey, provider);

const contract = new ethers.Contract(contractAddress, abi, wallet);

console.log('Listening for EventTest events...');

contract.on('EventTest', async (sender, value) => {
    console.log(`EventTest received: sender=${sender}, value=${value.toString()}`);

    try {
        const tx = await contract.changeStorage(value);
        console.log(`changeStorage transaction sent: ${tx.hash}`);

        const receipt = await tx.wait();
        console.log(`Transaction mined: ${receipt.transactionHash}`);
    } catch (error) {
        console.error(`Error calling changeStorage: ${error}`);
    }
});

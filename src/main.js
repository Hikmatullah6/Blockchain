// Import libraries
const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate("d1c7121c1c6e5896392e6c796baac5451b3e80700b635606d92be690a42c7f8c");
const myWalletAddress = myKey.getPublic("hex");

// Testing

let exampleCoin = new Blockchain(); // Example coin

// Test 1: Adding to blockchain, and tampering.
// exampleCoin.addBlock(new Block(1, "10/07/2024", { amount: 4 }));    // Add 4 exampleCoins to the blockchain.
// exampleCoin.addBlock(new Block(2, "12/07/2024", { amount: 10 }));   // Add another 10 exampleCoins to the blockchain.

// console.log('Is blockchain valid? ' + exampleCoin.isChainValid());  // Checks if the blockchain is valid. No tampering has been done, should return true.

// exampleCoin.chain[1].data = { amount: 100 };    // Tamper with the data of the first block (after Genesis Block). Change the amount transferred.
// exampleCoin.chain[1].hash = exampleCoin.chain[1].calculateHash();   // Tamper with the hash of the first block (after Genesis Block).

// console.log('Is blockchain valid? ' + exampleCoin.isChainValid());  // Blockchain has been tampered with. Should return false.
// console.log(JSON.stringify(exampleCoin, null, 4));

// Test 2: Mining blocks

// console.log("Mining block 1...");
// exampleCoin.addBlock(new Block(1, "10/07/2024", { amount: 4 }));    // Add 4 exampleCoins to the blockchain.

// console.log("Mining block 2...");
// exampleCoin.addBlock(new Block(2, "12/07/2024", { amount: 10 }));   // Add another 10 exampleCoins to the blockchain.

// Test 3: Rewards and transactions 

// exampleCoin.createTransaction(new Transaction("address1", "address2", 100));
// exampleCoin.createTransaction(new Transaction("address2", "address1", 50));

// console.log("\nStarting the miner...");
// exampleCoin.minePendingTransactions("hussains-address");

// console.log("\nBalance of hussain is", exampleCoin.getBalanceOfAddress("hussains-address"));

// console.log("\nStarting the miner again...");
// exampleCoin.minePendingTransactions("hussains-address");

// console.log("\nBalance of hussain is", exampleCoin.getBalanceOfAddress("hussains-address"));

// Test 4: Signing Transactions

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10);   // Create transaction
tx1.signTranaction(myKey);  // Sign transaction
exampleCoin.addTransaction(tx1);    // Add transaction to pending array

console.log("\nStarting the miner...");
exampleCoin.minePendingTransactions(myWalletAddress);   // Mine the pending transactions

console.log("\nBalance of hussain is", exampleCoin.getBalanceOfAddress(myWalletAddress));   // Balance is reward - amount sent

console.log("Is chain valid?", exampleCoin.isChainValid()); // No tampering has been done, return true

exampleCoin.chain[1].transactions[0].amount = 1;    // Tamper with chain by changing the amount sent

console.log("\nTampering has been done, is chain still valid?", exampleCoin.isChainValid());    // Returns false


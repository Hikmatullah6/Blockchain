
const { Blockchain, Transaction } = require('./blockchain');

// Testing

// Test 1: Adding to blockchain, and tampering.
// let exampleCoin = new Blockchain(); // Example coin
// exampleCoin.addBlock(new Block(1, "10/07/2024", { amount: 4 }));    // Add 4 exampleCoins to the blockchain.
// exampleCoin.addBlock(new Block(2, "12/07/2024", { amount: 10 }));   // Add another 10 exampleCoins to the blockchain.

// console.log('Is blockchain valid? ' + exampleCoin.isChainValid());  // Checks if the blockchain is valid. No tampering has been done, should return true.

// exampleCoin.chain[1].data = { amount: 100 };    // Tamper with the data of the first block (after Genesis Block). Change the amount transferred.
// exampleCoin.chain[1].hash = exampleCoin.chain[1].calculateHash();   // Tamper with the hash of the first block (after Genesis Block).

// console.log('Is blockchain valid? ' + exampleCoin.isChainValid());  // Blockchain has been tampered with. Should return false.
// console.log(JSON.stringify(exampleCoin, null, 4));

// Test 2: Mining blocks
// let exampleCoin = new Blockchain(); // Example coin

// console.log("Mining block 1...");
// exampleCoin.addBlock(new Block(1, "10/07/2024", { amount: 4 }));    // Add 4 exampleCoins to the blockchain.

// console.log("Mining block 2...");
// exampleCoin.addBlock(new Block(2, "12/07/2024", { amount: 10 }));   // Add another 10 exampleCoins to the blockchain.

// Test 3: 
let exampleCoin = new Blockchain();

exampleCoin.createTransaction(new Transaction("address1", "address2", 100));
exampleCoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\nStarting the miner...");
exampleCoin.minePendingTransactions("hussains-address");

console.log("\nBalance of hussain is", exampleCoin.getBalanceOfAddress("hussains-address"));

console.log("\nStarting the miner again...");
exampleCoin.minePendingTransactions("hussains-address");

console.log("\nBalance of hussain is", exampleCoin.getBalanceOfAddress("hussains-address"));
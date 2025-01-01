const SHA256 = require('crypto-js/sha256');

// Transaction class
class Transaction {
    // Constructor for transactions.
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

// Block class
class Block {
    // Constructor for block creation.
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // "Number used only once" added for mining process. 
    }

    // Calculate the hash for blocks. 
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Block mining. Supports proof of work procedure. 
    // Difficulty determines how long it will take to mine a block. 
    // Higher the difficulty, longer it takes to mine.
    mineBlock(difficulty) {
        // while loop runs until hash starts with enough zeros. 
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;   // Increase nonce by one for each attempt.
            this.hash = this.calculateHash();   // Calculate hash
        }
        console.log("Block mined: " + this.hash);
    }
}

// Blockchain class
class Blockchain {
    // Constructor for the chain. Creates an array with the Genesis Block as the first block.
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;    // Set difficulty to a number (the larger the number, the longer it takes to mine). 
        this.pendingTransactions = [];  // Array of pending transactions
        this.miningReward = 100;    // Reward for mining 
    }

    // Create the Genesis Block. 
    // The Genesis Block doesn't have a previous hash due to it being the first block in the chain. 
    // This Genesis Block was created on the first day of this year (for example).
    createGenesisBlock() {
        return new Block("01/01/2024", "Genesis block", "0");
    }

    // Return the latest block in the chain.
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Add a new block to the chain. 
    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash; // The latest block's hash will be the previous hash of the newly created block.
    //     // newBlock.hash = newBlock.calculateHash();   // Calculate hash for the new block.
    //     newBlock.mineBlock(this.difficulty);    // Mine block
    //     this.chain.push(newBlock);  // Add the new block to the chain.
    // }

    // Send mining rewards to address
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);   // Mine block

        console.log("Block successfully mined!");
        this.chain.push(block); // Add to chain

        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)]; // Send reward to address
    }

    // Receive transaction and add transaction to pending transaction array
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Check balance of address
    getBalanceOfAddress(address) {
        let balance = 0;

        // Loop over blocks of chain
        for (const block of this.chain) {
            // Loop over the transactions in the block
            for (const trans of block.transactions) {
                // If you are the from address, that means you transferred coins to someone.
                if (trans.fromAddress === address) {
                    balance -= trans.amount;    // Decrease balance
                }

                // If you are the toAddress, that means someone transferred coins to you.
                if (trans.toAddress === address) {
                    balance += trans.amount;    // Increase balance
                }
            }
        }

        return balance; // Return balance
    }

    // Check if the chain is valid.
    // Makes sure there has been no tampering with the chain.
    // Validates the chain by checking if each block has the correct hash.
    isChainValid() {
        // Iterates through the chain, starting at the first block after the Genesis Block.
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Check if the hash for the current block is the same when recalculated.
            // This will make sure there has been no tampering with the current block by ensuring the hash is the same when recalculated.
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Check the previous hash of the current block with the hash of the previous block.
            // This will make sure that chain hasn't been broken and that the block hasn't been tampered with.
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;    // Return true if its valid.
    }
}

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
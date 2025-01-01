// Import libraries
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Transaction class
class Transaction {
    // Constructor for transactions.
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    // Calculate hash for transaction
    calculateHash() {
        return SHA256(this.address + this.toAddress + this.amount).toString();
    }

    // Sign transaction
    signTranaction(signingKey) {
        // Check if public key equals fromAddress
        if (signingKey.getPublic("hex") !== this.fromAddress) {
            throw new Error("You cannot sign transactions for other wallets!");
        }

        const hashTx = this.calculateHash();    // Create hash of transaction
        const sig = signingKey.sign(hashTx, "base64");  // Sign the hash of transaction in base64
        this.signature = sig.toDER("hex");  // Store signature 
    }

    // Check if transaction is valid
    isValid() {
        if (this.fromAddress === null) return true; // Assume valid due to mining rewards

        // Check if theres a signature
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature in this transaction");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, "hex");    // Extract public key
        return publicKey.verify(this.calculateHash(), this.signature);    // Verify hash of block has been signed by signature
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

    // Verify all transactions in current block
    hasValidTransactions() {
        // For each transaction
        for (const tx of this.transactions) {
            // If transaction is not valid, return false
            if (!tx.isValid()) {
                return false;
            }
        }
        // Return true due to transactions being valid
        return true;
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

    // // Send mining rewards to address
    // minePendingTransactions(miningRewardAddress) {
    //     let block = new Block(Date.now(), this.pendingTransactions);
    //     block.mineBlock(this.difficulty);   // Mine block

    //     console.log("Block successfully mined!");
    //     this.chain.push(block); // Add to chain

    //     this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)]; // Send reward to address
    // }

    // Send mining rewards to address
    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward); // Mining reward
        this.pendingTransactions.push(rewardTx);    // Add reward to pending transaction

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);    // Create block
        block.mineBlock(this.difficulty);   // Mine block

        console.log("Block successfully mined!");
        this.chain.push(block); // Add to chain

        this.pendingTransactions = [];  // Set array to empty
    }

    // Receive transaction and add transaction to pending transaction array
    addTransaction(transaction) {

        // Check if transaction has to and from address
        if (!transaction.toAddress || !transaction.fromAddress) {
            throw new Error("Transaction must include to and from address");
        }

        // Check if transaction is valid
        if (!transaction.isValid()) {
            throw new Error("Cannot add invalid transaction to chain");
        }

        // Add to pendingTransactions
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

            // Check if block has valid transactions
            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

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

// Export
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
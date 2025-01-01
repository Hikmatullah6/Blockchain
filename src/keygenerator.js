// Import libraries 
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic("hex"); // Public key in hex form
const privateKey = key.getPrivate("hex");   // Private key in hex form

console.log();
console.log("Private key:", privateKey);

console.log();
console.log("Public key:", publicKey);
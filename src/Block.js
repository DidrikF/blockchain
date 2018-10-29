import { sha256, validateTransaction } from './helpers';

export default class Block {
  constructor () {
    // Block Header
    this.timestamp = (new Date()).toString();
    this.prevHash = ""; // hash of the previous block's header, will be a hash list
    this.txRoot = ""; // hash of all transactions in the system, will be a Merkele tree
    // Block Body
    this.transactions = []; // All the transactions in the block. It can be 1 or more. If more than 1 it should follow the property of merkle root*

    this.errors = [];

  }

  addTransaction (transaction) {
    if (!validateTransaction(transaction)) {
      console.log("Invalid transaction"); 
      return;
    }

    this.transactions.push(transaction);
  }

  addError(error) {
    if (!(error instanceof Error)) {
      console.log("Errors added to a block must be an instance of Error");
      return;
    }
    this.errors.push(error);
  }
  
  /*
  The raw transaction format is hashed to create the transaction identifier (txid). From these txids, 
  the merkle tree is constructed by pairing each txid with one other txid and then hashing them together. 
  If there are an odd number of txids, the txid without a partner is hashed with a copy of itself.

  The resulting hashes themselves are each paired with one other hash and hashed together. Any hash 
  without a partner is hashed with itself. The process repeats until only one hash remains, the 
  merkle root.
  */
  async calculateMerkleRoot () {
    let transHash = [];
    let hashCache = [];

    for (let i = 0; i < this.transactions.length; i++) {
      const hash = await sha256(JSON.stringify(this.transactions[i]));
      transHash.push(hash);
    }

    //console.log(transHash);
    //console.log(hashCache);

    while (transHash.length > 1) {
      for (let i = 0; i < transHash.length; i=i+2) {
        // console.log("transHash length: ", transHash.length);

        const current = transHash[i];
        const lastIndex = transHash.length-1
        const noNext = (i + 1) > lastIndex;

        if (noNext) {
          // hash current||current
          const hash = await sha256(current+current)
          hashCache.push(hash);
        } else {
          const next = transHash[i+1];
          // hash current||next
          const hash = await sha256(current+next)
          hashCache.push(hash);
        }
      }
      transHash = hashCache.slice();
      hashCache = [];
      //console.log(transHash);
      //console.log(hashCache);
    }

    return transHash[0];
  }

  hashHeader () {
    const header = {
      timestamp: this.timestamp,
      prevHash: this.prevHash,
      txRoot: this.txRoot
    };

    return sha256(JSON.stringify(header)); 
  }

}


/*
transaction = {
  sender: "Didrik",
  receiver: "Emilie",
  operation: "type", // deposit, withdraw, transfer
  amount: 400
}

*/



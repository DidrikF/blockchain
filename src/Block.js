

export default class Block {
  constructor (date, prevHash) {
    // Block Header
    this.timestamp = date;
    this.prevHash = prevHash; // hash of the previous block's header, will be a hash list
    this.txRoot = null; // hash of all transactions in the system, will be a Merkele tree
    // Block Body
    this.transactions = []; // All the transactions in the block. It can be 1 or more. If more than 1 it should follow the property of merkle root*

  }

  addTransaction () {

  }

  createHash () {

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



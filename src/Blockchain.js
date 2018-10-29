
import Block from './Block';

export default class Blockchain {
  constructor () {
    this.blockchain = [];
  }

  initializeWithGenesisBlock () {

  }

  addBlock (block) {
    if (Object.getPrototypeOf(Block) === Block) {
      console.log("Can only add blocks to the blockchain.")
      return;
    }

    
  }

  getLastBlock () {

  }

  validateChain () {
    for (let i = 1; i < this.blockchain.length; i++) {

    }
  }
}
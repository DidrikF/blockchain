import Block from './Block';
import { sha256 } from './helpers';

export default class Blockchain {
  constructor () {
    this.chain = [];
  }

  async initializeWithGenesisBlock () {
    const prevHash = await sha256("Genesis block hash seed for prevHash");
    const txRoot = await sha256(JSON.stringify([]));
    const genesisBlock = new Block();
    genesisBlock.txRoot = txRoot;
    genesisBlock.prevHash = prevHash;
    this.chain.push(genesisBlock);
    return genesisBlock;
  }

  async addBlock (block, index) {
    let lastBlock;
    
    if (index) {
      lastBlock = this.chain[index-1]
    } else {
      lastBlock = this.getLastBlock();
    }
    
    // add prevHeader
    const hashOfLastBlockHeader = await lastBlock.hashHeader();
    block.prevHash = hashOfLastBlockHeader
    
    // calculate txRoot
    block.txRoot = await block.calculateMerkleRoot();

    // add block to chain
    if (index) {
      this.chain[index] = block;
    } else {
      this.chain.push(block);
    }

    // return the block
    return block
  }

  getLastBlock () {
    return this.chain[this.chain.length-1]
  }

  async validate () {
    let corruptionDiscovered = false;
    // reset errors
    for (let i = 0; i < this.chain.length; i++) {
      this.chain[i].errors = [];
    }

    // validate genesis block:  
    const genesisPrevHash = await sha256("Genesis block hash seed for prevHash");
    const genesisTxRoot = await sha256(JSON.stringify([]));
    if (this.chain[0].prevHash !== genesisPrevHash) {
      this.chain[0].errors.push(new Error("PrevHash is not correct"));
      corruptionDiscovered = true;
    }
    if (this.chain[0].txRoot !== genesisTxRoot) {
      this.chain[0].errors.push(new Error("txRoot does not match an empty collection of transactions"));
      corruptionDiscovered = true;
    }

    // validate other blocks
    for (let i = 1; i < this.chain.length; i++) {
      const last = this.chain[i-1];
      const current = this.chain[i];

      // validate own txRoot (is recalculated when corrupting, so this will never trigger, but will have
      // changed the header of the block, causing it to miss-match with the next blocks prevHash)
      const currentTxRoot = await current.calculateMerkleRoot();
      if (current.txRoot !== currentTxRoot) {
        this.chain[i].errors.push(new Error(`Merkle Root ${currentTxRoot} does not match the blocks transactions`));
        corruptionDiscovered = true;
      }
      
      // validate prevHash (if prevHash does not match with previous blocks hashed header -> it has been corrupted)
      const hashOfLastHeader = await last.hashHeader();
      if (hashOfLastHeader !== current.prevHash) {
        this.chain[i-1].addError(new Error(`prevHash of the next block does not this block's header-hash (${hashOfLastHeader})`));
        corruptionDiscovered = true;
      }
    }

    return corruptionDiscovered;
  }
}
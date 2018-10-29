<template>
  <div id="app">
    <header>
      <h1>Blockchain Bank</h1>
    </header>
    <div class="counter grid">
      <!-- Left Side -->
      <div class="teller grid__left">
        <h3>Teller Section</h3>
        
        <h5 class="transactions__header">New Transactions (to be added)</h5>
        <table class="transactions">
          <tr>
            <th>Sender</th><th>Receiver</th><th>Type</th><th>Amount</th>
          </tr>
          <tr :key="index" v-for="(transaction, key, index) in newTransactions">
            <td>{{ transaction.sender }}</td>
            <td>{{ transaction.receiver }}</td>
            <td>{{ transaction.type }} </td>
            <td>{{ transaction.amount }}</td>
          </tr>
        </table>
        <div>
          <button @click="createAndCommitBlock()">Step 2: Create and commit block</button>
        </div>
        <h5 class="transactions__header">All Transactions on the Blockchain</h5>
        <table class="transactions">
          <tr>
            <th>Sender</th><th>Receiver</th><th>Type</th><th>Amount</th>
          </tr>
          <tr :key="index" v-for="(transaction, key, index) in transactions">
            <td>{{ transaction.sender }}</td>
            <td>{{ transaction.receiver }}</td>
            <td>{{ transaction.type }} </td>
            <td>{{ transaction.amount }}</td>
          </tr>
        </table>

        
      </div>

      <!-- Right Side -->
      <div class="custommer grid__right">
        <h3>Custommer Section</h3>
        <div class="form__group">
          <label for="sender">Sender</label>
          <input type="text" id="sender" class="input" v-model="newTransaction.sender">
        </div>
        <div class="form__group">
          <label for="receiver">Receiver</label>
          <input type="text" id="receiver" class="input" v-model="newTransaction.receiver">
        </div>
        <div class="form__group">
          <label for="type">Type</label>
          <input type="text" id="type" class="input" v-model="newTransaction.type">
        </div>
        <div class="form__group">
          <label for="amount">Amount</label>
          <input type="number" id="amount" class="input" v-model="newTransaction.amount">
        </div>
        <button @click="addTransaction()">Step 1: Add transaction to next block</button>
        <br><br>
        <div class="form__group">
          <label for="corruptBlock">Corrupt Block</label>
          <input type="text" id="corruptBlock" class="input" v-model="corruptBlock">
        </div>
        <button @click="addTransactionToBlock()">Step 3: Corrupt block {{corruptBlock}} by adding transaction to it</button>
        <br>
        <button @click="validateBlockchain()">Step 4: Validate Blockchain</button>
        <p class="error">{{ this.error }}</p>
        <p class="message">{{ message }}</p>
      </div>
    </div>

    <h2>The Blockchain</h2>
    <div class="blockchain">
      <div class="blockchain__blocks">
        <!-- 'index', 'timestamp', 'prevHash', 'txRoot', 'transactions', 'badBlock'-->
        <block :key="index" v-for="(block, index) in blockchain.chain" 
          :index="index + 1"
          :timestamp="block.timestamp"
          :prevHash="block.prevHash"
          :txRoot="block.txRoot"
          :transactions="block.transactions"
          :errors="block.errors"
        ></block>
      </div>
    </div>

    <div class="console">
      <div class="console__input">

      </div>
      <div class="console__output">

      </div>
    </div>

  </div>
</template>

<script>
/*
• Input transaction/s for a block.
• Create the block and display the entire block, which include the previous block header hash.
  Also display the hash of that block header.
• Must be able to repeat the above steps.
• Finally should display all the blocks added in the blockchain.
• For the first block you can hardcode the block and the values.
*/

// VALIDATE TRANSACTOIN INPUT ETX.


import Block from './Block';
import Blockchain from './Blockchain';
import BlockComponent from './components/Block.vue';
import { sha256, validateTransaction } from './helpers';

export default {
  name: 'App',
  data () {
    return {
      blockchain: null,
      newTransactions: [],
      newTransaction: {
        sender: "User1",
        receiver: "User2",
        type: "transfer",
        amount: 500,
      },
      error: "",
      corruptBlock: 2,
      message: "",
    }
  },
  computed: {
    transactions () {
      const transactions = [];
      const chain = this.blockchain.chain || [];
      for (let block of chain) {
        transactions.push(...block.transactions)
      }
      return transactions;
    }
  },
  methods: {
    addTransaction () {
      this.error = "";

      const transaction = {
        sender: this.newTransaction.sender,
        receiver: this.newTransaction.receiver,
        type: this.newTransaction.type,
        amount: parseInt(this.newTransaction.amount),
      }
      
      if (!validateTransaction(transaction)) {
        this.error = "Cannot add trasaction, because it failed validation.";
        return;
      }
      this.newTransactions.push(transaction);
    },
    async createAndCommitBlock () {
      let block = new Block();
      for (let transaction of this.newTransactions) {
        block.addTransaction(transaction);
      }
      try {
        block = await this.blockchain.addBlock(block)
        this.newTransactions = [];
      } catch (err) {
        console.log(error)
      }

    },
    addTransactionToBlock () {
      if (this.corruptBlock < 2) {
        this.error = "Cannot corrupt genesis block, choose another block to corrupt."
        return;
      }

      const transaction = {
        sender: this.newTransaction.sender,
        receiver: this.newTransaction.receiver,
        type: this.newTransaction.type,
        amount: parseInt(this.newTransaction.amount),
      };
      
      if (!validateTransaction(transaction)) {
        this.error = "Cannot add transaction, because it failed validation.";
        return;
      }

      const block = this.blockchain.chain[this.corruptBlock - 1];
      
      block.addTransaction(transaction);

      this.blockchain.addBlock(block, this.corruptBlock-1);
    },
    async validateBlockchain () {
      this.message = "";
      this.error = "";
      const corruptionDiscovered = await this.blockchain.validate();
      if (!corruptionDiscovered) {
        this.message = "Blockchain validation completed and no corruptions discovered!"
      } else {
        this.error = "Blockchain failed validation!";
      }
    },
  },
  async created () {
    this.blockchain = new Blockchain();
    const genesisBlock = await this.blockchain.initializeWithGenesisBlock()
    let block1 = new Block()
    block1.addTransaction({
      sender: "Didrik",
      receiver: "Emilie",
      type: "transfer",
      amount: 100,
    })

    block1.addTransaction({
      sender: "Philip",
      receiver: "Didrik",
      type: "transfer",
      amount: 670,
    })

    block1.addTransaction({
      sender: "Harald",
      receiver: "Didrik",
      type: "transfer",
      amount: 1000,
    })

    let block2 = new Block();
    block2.addTransaction({
      sender: "Alice",
      receiver: "Bob",
      type: "transfer",
      amount: 300,
    })

    block1 = await this.blockchain.addBlock(block1);
    block2 = await this.blockchain.addBlock(block2);


  },
  components: {
    block: BlockComponent,
  }
}
</script>

<style lang="sass">


body
  
#app
  width: 700px
  margin: 0 auto

h5
  font-size: 1.3em
  margin: 0
h6 
  font-size: 1.1em
  margin: 0

header 

.message
  color: green

.error
  color: red


  

.grid
  display: grid
  grid-columns: 1fr 1fr
  grid-template-areas: "left right"
  .grid__left
    grid-area: left
  .grid__right
    grid-area: right

.counter

.teller
  border-right: 1px solid black
  padding: 5px

.transactions__header
  margin-top: 10px
.transactions
  margin: 10px 0

.custommer
  padding: 5px
.blockchain

.console

.console__input

.console__output



</style>

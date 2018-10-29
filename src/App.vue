<template>
  <div id="app">
    <header>

    </header>
    <div class="counter">
      <div class="teller grid_1">

      </div>
      <div class="custommer grid_2">

      </div>
    </div>

    <div class="blockchain">
      
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

import Block from './Block';
import Blockchain from './Blockchain';
import BlockComponent from './components/Block.vue';

export default {
  name: 'App',
  data () {
    return {
      blockchain: null,

    }
  },
  methods: {
    createTransaction () {

    },
    createAndCommitBlock () {

    },
    corrupt () {

    },
    validateBlockchain () {

    },
  },
  components: {
    block: BlockComponent,
  }
}
</script>

<style lang="sass">


body
  
.app

header 

.counter

.teller

.custommer

.blockchain

.console

.console__input

.console__output



</style>

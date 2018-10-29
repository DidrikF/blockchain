<template>
  <div class="block" :class="{ red: corrupted }">
    <h5>Block {{ index }}</h5>
    <div class="header">
      <h6>Header</h6>
      <table>
        <tr>
          <td>Timestamp</td>
          <td>{{ timestamp }}</td>
        </tr>
        <tr>
          <td>prevHash</td>
          <td>{{ prevHash }}</td>
        </tr>
        <tr>
          <td>txRoot</td>
          <td>{{ txRoot }}</td>
        </tr>
      </table>

    </div>
    <h6>Transactions</h6>
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
    <div class="errors">
      <h6 v-if="errors.length">Block validation errors</h6>
      <p :key="index" v-for="(error, index) in errors">{{ error.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  props: ['index', 'timestamp', 'prevHash', 'txRoot', 'transactions', 'errors'],
  computed: {
    corrupted () {
      if (this.errors.length) return true;
      return false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="sass" scoped>

.block
  border: 1px solid black
  margin: 10px 0

.red 
  background: #dd0000

.errors>p
  margin: 3px 0

.header
  border-bottom: 1px solid black
  border-top: 1px solid black

</style>

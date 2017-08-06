<template>
  <v-card class="grey lighten-4 elevation-0">
    <v-card-text>
      <p>{{ last_txid }}</p>
      <v-container fluid>
        <v-layout row>
          <v-flex xs4>
            <v-subheader>Address of recepient</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              name="address"
              label="Address"
              id="address"
              v-model="address"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader>Amount in BTC</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              name="amount"
              label="Amount"
              id="amount"
              v-model="amount"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs4>
            <v-subheader>Fee</v-subheader>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              name="fee"
              label="Fee"
              id="fee"
              v-model="fee"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn success
          :loading="loading"
          @click.native="sendBTC"
          :disabled="loading"
          >
          Send
        </v-btn>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import BitcoinJS from 'bitcoinjs-lib'
import Axios from 'axios'

export default {
  data () {
    return {
      address: 'mzVjXYfGBwphT4t6cBcuGAxQd2DzUnNp9k',
      amount: 0.0001,
      fee: 0.00005,
      loading: false,
      last_txid: ''
    }
  },
  localStorage: {
    wifs: {
      type: Array,
      default: []
    }
  },
  methods: {
    getKeyPairByWIF (wif) {
      return BitcoinJS.ECPair.fromWIF(wif, BitcoinJS.networks.testnet)
    },
    getKeyPairByAddress (address) {
      let wifs = this.$localStorage.get('wifs')
      for (let i = 0; i < wifs.length; i++) {
        let keyPair = this.getKeyPairByWIF(wifs[i].wif)
        if (keyPair.getAddress() === address) {
          return keyPair
        }
      }
      return -1
    },
    sendBTC () {
      this.loading = true
      let self = this
      // Get Addresses
      let wifs = this.$localStorage.get('wifs')
      let addresses = []
      for (let i = 0; i < wifs.length; i++) {
        addresses.push(this.getKeyPairByWIF(wifs[i].wif).getAddress())
      }

      // Get Utxo
      Axios.post('http://localhost:3001/insight-api/addrs/utxo', {
        addrs: addresses.join()
      })
        .then(function (response) {
          console.log(response)
          let transaction = self.createTransaction(response.data)
          if (transaction === -1) {
            alert('Not enough coins')
            self.loading = false
          } else {
            self.sendTransaction(transaction)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    createTransaction (utxos) {
      let sum = 0.0
      let tx = new BitcoinJS.TransactionBuilder(BitcoinJS.networks.testnet)
      let changeAddress = this.getKeyPairByWIF(this.$localStorage.get('wifs')[0].wif).getAddress()
      let amount = parseFloat(this.amount)
      let fee = parseFloat(this.fee)

      let signs = []

      while ((sum < amount + fee) && utxos.length > 0) {
        let index = Math.floor(Math.random() * utxos.length) // Random coin selector

        tx.addInput(utxos[index].txid, utxos[index].vout)
        sum += utxos[index].amount
        signs.push(this.getKeyPairByAddress(utxos[index].address))
        utxos.splice(index, 1)
      }

      if (sum < amount + fee) {
        return -1
      }

      // Amount to send
      tx.addOutput(this.address, amount * 100000000) // to Satoshi

      // Fee and change
      if (sum !== amount + fee) {
        tx.addOutput(changeAddress, (sum - amount - fee) * 100000000) // to Satoshi
      }

      // Sign
      for (let i = 0; i < signs.length; i++) {
        tx.sign(i, signs[i])
      }

      return tx.build().toHex()
    },
    sendTransaction (tx) {
      let self = this
      Axios.post('http://localhost:3001/insight-api/tx/send', {
        rawtx: tx
      })
        .then(function (response) {
          self.last_txid = 'Transaction ID: ' + response.data.txid
          self.amount = 0.0
          self.fee = 0.0
          self.loading = false
        })
        .catch(function (error) {
          console.log(error)
          self.loading = false
        })
    }
  }
}
</script>

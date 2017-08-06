<template>
  <v-expansion-panel>
    <v-expansion-panel-content v-for="(wifObj,index) in wifs" :key="index">
      <div slot="header">{{ wifObj.wif }}</div>
      <v-card>
        <v-card-text class="grey lighten-3">
          <tree-view :data="wifObj.transactions" :options="{maxDepth: 1}"></tree-view>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import BitcoinJS from 'bitcoinjs-lib'
import Axios from 'axios'

export default {
  data () {
    return {
      wifs: []
    }
  },
  localStorage: {
    wifs: {
      type: Array,
      default: []
    }
  },
  mounted () {
    this.wifs = this.$localStorage.get('wifs')
    for (let i = 0; i < this.wifs.length; i++) {
      this.getTransactions(this.wifs[i])
    }
  },
  methods: {
    getKeyPairByWIF (wif) {
      return BitcoinJS.ECPair.fromWIF(wif, BitcoinJS.networks.testnet)
    },
    getTransactions (wifObj) {
      let keyPair = this.getKeyPairByWIF(wifObj.wif)

      Axios.get('http://localhost:3001/insight-api/txs/?address=' + keyPair.getAddress())
        .then(function (response) {
          wifObj.transactions = response.data.txs
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

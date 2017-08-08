<template>
  <div id="wallet">
    <h3>{{ totalBalance }} BTC <span class="body-2"> / {{ totalUnconfirmedBalance }} Unconfirmed BTC</span></h3>
    <v-list two-line>
      <v-subheader>My addresses</v-subheader>
      <template v-for="(wifObj, index) in wifs">
        <v-divider></v-divider>
        <v-list-tile avatar v-bind:key="wifObj.wif" href="javascript:;">
          <v-list-tile-avatar>
            <img src="http://www.iconarchive.com/download/i99270/froyoshark/enkel/Bitcoin.ico">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ getAddress(wifObj.wif) }}
              <v-btn error @click="removeWIF(index)">
                remove
              </v-btn>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              Confirmed BTC: <b>{{ wifObj.balance }}</b> Unconfirmed BTC: <b>0</b>
            </v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-text-field
        name="new_wif"
        label="WIF"
        id="new_wif"
        v-model="new_wif"
    ></v-text-field>
    <v-btn success @click="addWIF">
      Add new WIF
    </v-btn>
    <v-btn @click="testSeed">
      Test Seed
    </v-btn>
  </div>
</template>

<script>
import BitcoinJS from 'bitcoinjs-lib'
import Axios from 'axios'
import Bip39 from 'bip39'

export default {
  data () {
    return {
      new_wif: '',
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
      this.getBalance(this.wifs[i])
      this.getUnconfirmedBalance(this.wifs[i])
    }
  },
  computed: {
    totalBalance () {
      let balance = 0
      for (let i = 0; i < this.wifs.length; i++) {
        balance += this.wifs[i].balance
      }
      return balance
    },
    totalUnconfirmedBalance () {
      let unconfirmedBalance = 0
      for (let i = 0; i < this.wifs.length; i++) {
        unconfirmedBalance += this.wifs[i].unconfirmedBalance
      }
      return unconfirmedBalance
    }
  },
  methods: {
    getKeyPairByWIF (wif) {
      return BitcoinJS.ECPair.fromWIF(wif, BitcoinJS.networks.testnet)
    },
    addWIF () {
      this.getKeyPairByWIF(this.new_wif)
      this.wifs.push({
        wif: this.new_wif,
        balance: 0,
        unconfirmedBalance: 0,
        transactions: []
      })
      this.$localStorage.set('wifs', this.wifs)
      this.new_wif = ''
      this.getBalance(this.wifs[this.wifs.length - 1])
      this.getUnconfirmedBalance(this.wifs[this.wifs.length - 1])
    },
    removeWIF (index) {
      this.wifs.splice(index, 1)
      this.$localStorage.set('wifs', this.wifs)
    },
    getAddress (wif) {
      let keyPair = this.getKeyPairByWIF(wif)
      return keyPair.getAddress()
    },
    getBalance (wifObj) {
      let keyPair = this.getKeyPairByWIF(wifObj.wif)

      Axios.get('http://localhost:3001/insight-api/addr/' + keyPair.getAddress() + '/balance')
        .then(function (response) {
          wifObj.balance = parseInt(response.data) * 0.00000001
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    getUnconfirmedBalance (wifObj) {
      let keyPair = this.getKeyPairByWIF(wifObj.wif)

      Axios.get('http://localhost:3001/insight-api/addr/' + keyPair.getAddress() + '/unconfirmedBalance')
        .then(function (response) {
          wifObj.unconfirmedBalance = parseInt(response.data) * 0.00000001
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    testSeed () {
      let seed = 'a3580f8f87e6b59b80df424d63e137ff884866d8866737d3ef8a8b149bfe9749f88876e3366e7409831067239be2667eed60d70f3a3818756baf9444350a3bba'
      let root = BitcoinJS.HDNode.fromSeedHex(seed, BitcoinJS.networks.testnet)
      let child1 = root.derivePath("m/0'/0/0")
      // let child1 = root.derivePath("m44'/1'/0'/0/0")
      console.log(child1.getAddress())

      let mnemonic = 'yard impulse luxury drive today throw farm pepper survey wreck glass federal'
      seed = Bip39.mnemonicToSeed(mnemonic)
      root = BitcoinJS.HDNode.fromSeedHex(seed, BitcoinJS.networks.testnet)
      child1 = root.derivePath("m/0'/0/0")
      console.log(child1.getAddress())
    }
  }
}
</script>

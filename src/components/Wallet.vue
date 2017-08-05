<template>
  <div id="wallet">
    <v-list two-line>
      <v-subheader>My addresses</v-subheader>
      <template v-for="(wif, index) in wifs">
        <v-divider></v-divider>
        <v-list-tile avatar v-bind:key="wif" href="javascript:;">
          <v-list-tile-avatar>
            <img src="http://www.iconarchive.com/download/i99270/froyoshark/enkel/Bitcoin.ico">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ getAddress(wif) }}
              <v-btn error @click="removeWIF(index)">
                remove
              </v-btn>
            </v-list-tile-title>
            <v-list-tile-sub-title>
              Confirmed balance: <b>0</b> Unconfirmed balance: <b>0</b>
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
  </div>
</template>

<script>
import BitcoinJS from 'bitcoinjs-lib'
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
  },
  methods: {
    addWIF () {
      BitcoinJS.ECPair.fromWIF(this.new_wif, BitcoinJS.networks.testnet)
      this.wifs.push(this.new_wif)
      this.$localStorage.set('wifs', this.wifs)
      this.new_wif = ''
    },
    removeWIF (index) {
      this.wifs.splice(index, 1)
      this.$localStorage.set('wifs', this.wifs)
    },
    getAddress (wif) {
      let keyPair = BitcoinJS.ECPair.fromWIF(wif, BitcoinJS.networks.testnet)
      return keyPair.getAddress()
    }
  }
}
</script>

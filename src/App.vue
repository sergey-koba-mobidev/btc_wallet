<template>
  <v-app id="example-2" standalone>
    <v-navigation-drawer permanent light>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar tag="ul">BTC Wallet</v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <template v-for="item in items">
          <v-list-tile :key="item.title" router :to="{ path: item.path }">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="cyan" dark>
      <v-toolbar-title>Toolbar</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: null,
        items: [
          { title: 'Nodes', icon: 'computer', path: 'nodes' },
          { title: 'Wallet', icon: 'work', path: 'wallet' },
          { title: 'Transactions', icon: 'list', path: 'transactions' }
        ],
        right: null
      }
    }
  }
</script>

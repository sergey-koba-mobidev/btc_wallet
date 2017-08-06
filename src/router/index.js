import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Wallet from '@/components/Wallet'
import Transactions from '@/components/Transactions'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/wallet',
      name: 'Wallet',
      component: Wallet
    },
    {
      path: '/transactions',
      name: 'Transactions',
      component: Transactions
    }
  ]
})

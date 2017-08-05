// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueLocalStorage from 'vue-localstorage'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueLocalStorage)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

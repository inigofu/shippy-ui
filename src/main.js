// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './vuex/store.js'
import axios from 'axios'

window.axios = axios
axios.defaults.baseURL = 'http://localhost:8080'
Vue.prototype.$http = window.axios
Vue.use(BootstrapVue)

// Check local storage to handle refreshes
console.log('hola01', store.state.token.token)
if (window.localStorage) {
  if (store.state.token.token !== window.localStorage.getItem('token')) {
    store.commit('SET_TOKEN', window.localStorage.getItem('token'))
  }
}
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  console.log('hola1', to.matched.some(record => record.meta.requiresAuth))
  console.log('hola11', to.path)
  console.log('hola111', store.state.token.token)
  if (to.matched.some(record => record.meta.requiresAuth) && (store.state.token.token === null)) {
    next('/pages/login')
  } else if ((store.state.token.token !== null) && to.path === '/pages/login') {
    next('/')
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store: store,
  components: {
    App
  }
})

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import { store, ability } from './vuex/store.js'
import { abilitiesPlugin } from '@casl/vue'

Vue.use(BootstrapVue)
Vue.use(abilitiesPlugin, ability)
window.ability = ability

// Check local storage to handle refreshes
if (window.localStorage) {
  if (store.state.user.token !== window.localStorage.getItem('token')) {
    store.commit('user/settoken', window.localStorage.getItem('token'))
  }
}
// Some middleware to help us ensure the user is authenticated.
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && (store.state.user.token === null)) {
    next('/pages/login')
  } else if ((store.state.user.token !== null) && to.path === '/pages/login') {
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

<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from '../_nav'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '../components/'

export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  data () {
    return {
      nav: []
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  mounted: function () {
    // `this` points to the vm instance
    console.log('mounted')
    var store = this.$store
    if (window.localStorage) {
      var token = window.localStorage.getItem('token')
      console.log('token: ' + token)
      if (token !== null) {
        this.$http.post('/rpc', {
          request: {
            token: token ? `Bearer ${token}` : ''
          },
          service: 'shippy.auth',
          method: 'Auth.ValidateToken'
        })
          .then(({ data }) => {
            if (data.valid) {
              console.log('app mounted data valid')
              this.$http.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : ''
              store.commit('SET_TOKEN', token)
              this.$http.post('/rpc', {
                request: {
                  email: store.state.user.email
                },
                service: 'shippy.auth',
                method: 'Auth.GetUserMenus'
              })
                .then(({ data }) => {
                  this.nav = data.menues
                  console.log(nav.items)
                  console.log(data.menues)
                }).catch((error) => {
                  const { status, data } = error.response
                  if (status === 422) {
                    this.error = data.body.message
                  }
                  throw error
                })
            } else {
              window.localStorage.removeItem('token')
              this.$router.push('/')
            }
          }).catch((error) => {
            const { status, data } = error.response
            if (status === 422) {
              this.error = data.body.message
            }
            throw error
          })
      }
    }
  },
  beforeDestroy: function () {
    // `this` points to the vm instance
    console.log('destroyed')
    window.localStorage.removeItem('token')
  }
}
</script>

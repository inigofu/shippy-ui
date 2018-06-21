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
// import nav from '../_nav'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '../components/'
import { mapState } from 'vuex'
export default {
  name: 'full',
  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },
  computed: {
    ...mapState({
      nav: state => state.user.nav
    }),
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    }
  },
  beforeDestroy: function () {
    // `this` points to the vm instance
    window.localStorage.removeItem('token')
  }
}
</script>

<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'app',
  mounted: function () {
    // `this` points to the vm instance
    console.log('app mounted')
    if (window.localStorage) {
      var token = window.localStorage.getItem('token')
      console.log('app mounted', token)
      if (token !== null) {
        this.validateToken(token)
          .then((data) => {
            this.$router.push('/')
          }).catch((error) => {
            this.$router.push('/')
            throw error
          })
      }
    }
  },
  methods: {
    ...mapActions({
      validateToken (dispatch, payload) {
        return dispatch('user/validateToken', payload)
      }
    })
  }
}
</script>

<style lang="scss">
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
</style>
<style>
  /* Import Flag Icons Set */
  @import 'flag-icon-css/css/flag-icon.min.css';
  /* Import Bootstrap Vue Styles */
  @import 'bootstrap-vue/dist/bootstrap-vue.css';
</style>
<style lang="scss">
  // Import Main styles for this application
  @import './assets/scss/style';
</style>

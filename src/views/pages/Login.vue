<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <form @submit.prevent="login">
                <h1>Login</h1>
                <p class="text-muted">Sign In to your account</p>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <input type="password" class="form-control" placeholder="Password" v-model="credentials.password">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button type="submit" variant="primary" class="px-4">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <b-button variant="link" class="px-0">Forgot password?</b-button>
                  </b-col>
                </b-row>
                </form>
              </b-card-body>
            </b-card>
            <b-card no-body class="text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <b-card-body class="text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <b-button variant="primary" class="active mt-3" href="#/pages/register" >Register Now!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data: function () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    login: function () {
      var store = this.$store
      this.$http.post('/rpc', {
        request: {
          email: this.credentials.username,
          password: this.credentials.password
        },
        service: 'shippy.auth',
        method: 'Auth.Auth'
      })
        .then(({ data }) => {
          var token = data.token.token
          store.commit('token/SET_TOKEN', token)
          // Save to local storage as well
          if (window.localStorage) {
            window.localStorage.setItem('token', token)
          }
          store.commit('user/SET_USER', data.user)
          this.$http.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : ''
          this.$router.push('/')
        }).catch((error) => {
          const { status, data } = error.response
          if (status === 422) {
            this.error = data.body.message
          }
          throw error
        })
    }
  }
}
</script>

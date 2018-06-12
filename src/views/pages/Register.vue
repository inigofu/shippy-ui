<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
               <form @submit.prevent="register">
              <h1>Register</h1>
              <p class="text-muted">Create your account</p>
              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-user"></i></b-input-group-text>
                </b-input-group-prepend>
                <input type="text" class="form-control" placeholder="Username" v-model="credentials.username">
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text>@</b-input-group-text>
                </b-input-group-prepend>
                <input type="text" class="form-control" placeholder="Email" v-model="credentials.email">
              </b-input-group>

              <b-input-group class="mb-3">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <input type="password" class="form-control" placeholder="Password" v-model="credentials.password">
              </b-input-group>

              <b-input-group class="mb-4">
                <b-input-group-prepend>
                  <b-input-group-text><i class="icon-lock"></i></b-input-group-text>
                </b-input-group-prepend>
                <input type="password" class="form-control" placeholder="Repeat password">
              </b-input-group>

              <b-button variant="success" type="submit" block>Create Account</b-button>
               </form>
            </b-card-body>
            <b-card-footer class="p-4">
              <b-row>
                <b-col cols="6">
                  <b-button block class="btn btn-facebook"><span>facebook</span></b-button>
                </b-col>
                <b-col cols="6">
                  <b-button block class="btn btn-twitter" type="button"><span>twitter</span></b-button>
                </b-col>
              </b-row>
            </b-card-footer>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data: function () {
    return {
      credentials: {
        username: '',
        password: '',
        email: ''
      },
      error: ''
    }
  },
  methods: {
    register: function () {
      var store = this.$store
      this.$http.post('/rpc', {
        request: {
          email: this.credentials.email,
          password: this.credentials.password,
          name: this.credentials.username
        },
        service: 'shippy.auth',
        method: 'Auth.Create'
      })
        .then(({ data }) => {
          var token = data.token
          store.commit('token/SET_TOKEN', token)
          // Save to local storage as well
          if (window.localStorage) {
            window.localStorage.setItem('token', token)
          }
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

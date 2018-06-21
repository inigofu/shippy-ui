import Api from './api'

export default {
  login (credentials) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
          email: credentials.username,
          password: credentials.password
        },
        service: 'shippy.auth',
        method: 'Auth.Login'
      })
        .then(({ data }) => {
          console.log('data', data)
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  validateToken (token) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
          token: token ? `Bearer ${token}` : ''
        },
        service: 'shippy.auth',
        method: 'Auth.UserToken'
      })
        .then(({ data }) => {
          console.log('data', data)
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

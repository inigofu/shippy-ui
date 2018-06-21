import Api from './api'

export default {
  getModel () {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
        },
        service: 'shippy.auth',
        method: 'Auth.GetAllRoles'
      })
        .then(({ data }) => {
          resolve(data.roles)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  saveModel (model) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.UpdateRole'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  addModel (model) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.UpdateRole'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteModel (model) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.DeleteRole'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

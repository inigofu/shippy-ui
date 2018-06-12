import Api from './Api'

export default {
  getModel () {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
        },
        service: 'shippy.auth',
        method: 'Auth.GetAll'
      })
        .then(({ data }) => {
          resolve(data.users)
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
        method: 'Auth.UpdateUser'
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
        method: 'Auth.Create'
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
        method: 'Auth.DeleteUser'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

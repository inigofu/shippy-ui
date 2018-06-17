import Api from './Api'

export default {
  getModel () {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
        },
        service: 'shippy.auth',
        method: 'Auth.GetAllSchemas'
      })
        .then(({ data }) => {
          resolve(data.formschemas)
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
        method: 'Auth.UpdateSchema'
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
        method: 'Auth.CreateSchema'
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
        method: 'Auth.DeleteSchema'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

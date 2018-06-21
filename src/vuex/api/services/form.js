import JSONfn from 'json-fn'
import Api from './api'
import { validators } from './validators.js'

function dataChek (key, value) {
  if (key === 'validator') {
    if (value !== null) {
      return validators[value]
    } else {
      return validators.required
    }
  }
  return value
}

export default {
  getSchema (formid) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
          id: formid
        },
        service: 'shippy.auth',
        method: 'Auth.GetForm'
      })
        .then(({ data }) => {
          let response = JSON.parse(JSONfn.stringify(data.form), dataChek)
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getModel () {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: {
        },
        service: 'shippy.auth',
        method: 'Auth.GetAllForms'
      })
        .then(({ data }) => {
          resolve(data.forms)
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
        method: 'Auth.UpdateForm'
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
        method: 'Auth.UpdateForm'
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
        method: 'Auth.DeleteForm'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteField (model) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.DeleteFields'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  },
  deleteTab (model) {
    return new Promise((resolve, reject) => {
      Api().post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.DeleteTabs'
      })
        .then(({ data }) => {
          resolve(data)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

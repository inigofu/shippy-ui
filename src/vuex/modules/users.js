import { services } from '../api'
import { clone } from 'lodash'

const state = {
  fields: ['id',
    'name',
    'email'],
  rows: Array,
  modelLoaded: false
}

const mutations = {
  setRows (state, rows) {
    state.rows = rows
  },
  setModelLoaded (state, loaded) {
    console.log('loaded', loaded)
    state.modelLoaded = loaded
  }
}
const actions = {
  getModel ({ commit, state }) {
    console.log('users getmodel')
    services.users.getModel()
      .then((response) => {
        commit('setRows', response)
        commit('setModelLoaded', true)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  saveModel ({ commit, state }, model) {
    return new Promise((resolve, reject) => {
      services.users.saveModel(model)
        .then((response) => {
          let tempRows = clone(state.rows)
          let temp = tempRows.filter(function (e) {
            return e.id === model.id
          })
          let index = tempRows.indexOf(temp[0])
          tempRows.splice(index, 1, response.form)
          commit('setRows', tempRows)
        })
        .catch((error) => {
          console.error(error)
        })
    })
  },
  addModel ({ commit, state }, model) {
    return new Promise((resolve, reject) => {
      services.users.addModel(model)
        .then((response) => {
          let tempRows = clone(state.rows)
          tempRows.push(response.form)
          commit('setRows', tempRows)
          resolve(response.form.id)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  deleteModel ({ commit, state }, model) {
    console.log('action delete model')
    return new Promise((resolve, reject) => {
      services.users.deleteModel(model)
        .then((response) => {
          let tempRows = clone(state.rows)
          let temp = tempRows.filter(function (e) {
            return e.id === model.id
          })
          let index = tempRows.indexOf(temp[0])
          tempRows.splice(index, 1)
          commit('setRows', tempRows)
          if (index !== 0) { index = index - 1 }
          resolve(index)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions
}

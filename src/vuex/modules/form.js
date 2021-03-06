import { services } from '../api'
import { clone } from 'lodash'

const state = {
  schema: Object,
  fields: ['id',
    'name'],
  rows: Array,
  model: null,
  schemaLoaded: false
}

const mutations = {
  setSchema (state, schema) {
    state.schema = schema
  },
  setRows (state, rows) {
    state.rows = rows
  },
  setModel (state, model) {
    state.model = model
  },
  setSchemaLoaded (state, loaded) {
    state.schemaLoaded = loaded
  }
}

const actions = {
  getSchema ({ commit, state }, formId) {
    services.form.getSchema(formId)
      .then((response) => {
        commit('setSchema', response)
        commit('setSchemaLoaded', true)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  getModel ({ commit, state }) {
    services.form.getModel()
      .then((response) => {
        commit('setRows', response)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  saveModel ({ commit, state }, model) {
    return new Promise((resolve, reject) => {
      services.form.saveModel(model)
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
      services.form.addModel(model)
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
    return new Promise((resolve, reject) => {
      services.form.deleteModel(model)
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
  },
  saveLayout ({ commit, state }, input) {
    return new Promise((resolve, reject) => {
      services.form.saveModel(input)
        .then((data) => {
          commit('setSchema', data.form)
          resolve()
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

const modules = {
  fields: {
    namespaced: true,
    actions: {
      deleteLine ({ commit, state, dispatch }, input) {
        return new Promise((resolve, reject) => {
          services.form.deleteField(input)
            .then((data) => {
              resolve()
            }).catch((error) => {
              reject(error)
            })
        })
      }
    }
  },
  tabs: {
    namespaced: true,
    actions: {
      deleteLine ({ commit, state, dispatch }, input) {
        return new Promise((resolve, reject) => {
          services.form.deleteTab(input)
            .then((data) => {
              resolve()
            }).catch((error) => {
              reject(error)
            })
        })
      }
    }
  }
}

export default {
  state,
  mutations,
  actions,
  modules
}

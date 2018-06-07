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
    console.log('loaded', loaded)
    state.schemaLoaded = loaded
  }
}

const actions = {
  getSchema ({ commit, state }, formId) {
    services.forms.getSchema(formId)
      .then((response) => {
        commit('setSchema', response)
        commit('setSchemaLoaded', true)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  getModel ({ commit, state }) {
    services.forms.getModel()
      .then((response) => {
        commit('setRows', response)
      })
      .catch((error) => {
        console.error(error)
      })
  },
  saveModel ({ commit, state }, model) {
    return new Promise((resolve, reject) => {
      services.forms.saveModel(model)
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
      services.forms.addModel(model)
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
      services.forms.deleteModel(model)
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
      services.forms.saveModel(input)
        .then((data) => {
          console.log('saved', data, input)
          commit('setSchema', data.form)
          resolve()
        }).catch((error) => {
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

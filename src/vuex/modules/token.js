import * as types from '../mutation-types'

const state = {
  token: null
}

const mutations = {
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.REMOVE_TOKEN] (state) {
    state.token = null
  }
}

export default {
  state,
  mutations
}

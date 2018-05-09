import * as types from '../mutation-types'

const state = {
  main: {
    name: 'Alexander Pierce',
    position: 'Web Developer',
    email: '',
    state: {
      color: '#3c763d',
      name: 'Online'
    },
    createdAt: new Date()
  }
}

const mutations = {
  [types.SET_USER] (state, user) {
    state.name = user.name
    state.email = user.email
  }
}

export default {
  state,
  mutations
}

import { services } from '../api'
import Api from '../api/services/api'

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
  },
  token: null,
  nav: []
}

const mutations = {
  setuser (state, user) {
    state.name = user.name
    state.email = user.email
  },
  settoken (state, token) {
    state.token = token
  },
  removetoken (state) {
    state.token = null
  },
  setnav (state, nav) {
    state.nav = nav
  }
}

const actions = {
  login ({ commit, state }, credentials) {
    return new Promise((resolve, reject) => {
      services.user.login(credentials)
        .then((data) => {
          var token = data.token.token
          commit('settoken', token)
          commit('setuser', data.user)
          commit('setnav', data.menues)
          // Save to local storage as well
          if (window.localStorage) {
            window.localStorage.setItem('token', token)
          }
          Api().defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : ''
          resolve()
        }).catch((error) => {
          reject(error)
        })
    })
  },
  validateToken ({ commit, state }, token) {
    return new Promise((resolve, reject) => {
      services.user.validateToken(token)
        .then((data) => {
          if (data.token.valid) {
            Api().defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : ''
            commit('settoken', token)
            commit('setuser', data.user)
            commit('setnav', data.menues)
          } else {
            window.localStorage.removeItem('token')
          }
          resolve()
        }).catch((error) => {
          window.localStorage.removeItem('token')
          reject(error)
        })
    })
  },
  logout ({ commit, state }) {
    commit('settoken', null)
  }
}
export default {
  state,
  mutations,
  actions
}

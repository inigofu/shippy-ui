const state = {
  errors: []
}

const mutations = {
  seterrors (state, error) {
    let errTemp = {'error': error, 'timer': 10}
    state.errors.push(errTemp)
  },
  deleteerror (state, index) {
    state.errors.splice(index, 1)
  }
}

export default {
  state,
  mutations
}

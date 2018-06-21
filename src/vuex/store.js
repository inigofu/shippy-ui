import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import { abilityPlugin, ability as appAbility } from './modules/abilitys'

Vue.use(Vuex)
export const ability = appAbility

export default new Vuex.Store({
  plugins: [
    abilityPlugin
  ],
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

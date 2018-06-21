const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if (key === './index.js' || key === './abilitys.js') return
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
  modules[key.replace(/(\.\/|\.js)/g, '')].namespaced = true
})
export default modules

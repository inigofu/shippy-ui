import JSONfn from 'json-fn'

export default {
  getSchema (formid) {
    this.$http.post('/rpc', {
      request: {
        id: formid
      },
      service: 'shippy.auth',
      method: 'Auth.GetForm'
    })
      .then(({ data }) => {
        this.schema = JSONfn.parse(JSONfn.stringify(data.form))
        console.log('data loaded', this.schema)
        this.dataLoaded = true
      }).catch((error) => {
        throw error
      })
  }
}

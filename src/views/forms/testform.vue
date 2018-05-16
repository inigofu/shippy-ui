<template>
  <div class="wrapper">
    <customForm :propID="id" :schema="schema" :fields="fields" :rows="rows"> </customForm>
  </div>
</template>
<script>
import customForm from '../../containers/form/form'
import JSONfn from 'json-fn'
import users from '../../containers/form/data'
import Fakerator from 'fakerator'

let fakerator = new Fakerator()
export default {
  name: 'testform',
  components: {
    customForm
  },
  data () {
    return {
      id: null,
      schema: {},
      fields: ['id',
        'name'],
      rows: []
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    next()
  },
  mounted () {
    // this.rows = users.users()
    this.$nextTick(function () {
      window.app = this

      if (users.length > 0) {
        this.selectRow(null, fakerator.random.arrayElement(users))
      }
    })
    this.getSchema()
    this.getData()
  },
  methods: {
    getSchema () {
      this.$http.post('/rpc', {
        request: {
          id: '251efbae-2a32-4bf6-a524-5a6d63cd8155'
        },
        service: 'shippy.auth',
        method: 'Auth.GetForm'
      })
        .then(({ data }) => {
          console.log(data.form)
          this.schema = JSONfn.parse(JSONfn.stringify(data.form))
        }).catch((error) => {
          throw error
        })
    },
    getData () {
      this.$http.post('/rpc', {
        request: {
        },
        service: 'shippy.auth',
        method: 'Auth.GetAllForms'
      })
        .then(({ data }) => {
          console.log('rows', data)
          this.rows = data.forms
        }).catch((error) => {
          throw error
        })
    }
  }
}
</script>

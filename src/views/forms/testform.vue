<template>
  <div class="wrapper">
    <template v-if="dataLoaded">
    <customForm :propID="id" :schema="schema" :fields="fields" :rows="rows" v-on:addModelEvent="addModel" v-on:deleteModelEvent="deleteModel" v-on:saveModelEvent="saveModel"> </customForm>
    </template>
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
      dataLoaded: false,
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
    console.log('testform mounted', this.schema)
  },
  methods: {
    getSchema () {
      this.$http.post('/rpc', {
        request: {
          id: 'bc5012d7-5945-46d9-95c0-82f57488423e'
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
    },
    getData () {
      this.$http.post('/rpc', {
        request: {
        },
        service: 'shippy.auth',
        method: 'Auth.GetAllForms'
      })
        .then(({ data }) => {
          this.rows = data.forms
        }).catch((error) => {
          throw error
        })
    },
    saveModel (model) {
      this.$http.post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.UpdateForm'
      })
        .then(({ data }) => {
          // this.rows = data.forms
        }).catch((error) => {
          throw error
        })
    },
    addModel (model) {
      console.log('ADDMODEL', model)
      this.$http.post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.UpdateForm'
      })
        .then(({ data }) => {
          // this.rows = data.forms
        }).catch((error) => {
          throw error
        })
    },
    deleteModel (model) {
      this.$http.post('/rpc', {
        request: model,
        service: 'shippy.auth',
        method: 'Auth.DeleteForm'
      })
        .then(({ data }) => {
          // this.rows = data.forms
        }).catch((error) => {
          throw error
        })
    }
  }
}
</script>

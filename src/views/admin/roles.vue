<template>
  <div class="wrapper">
    <template v-if="schemaLoaded && modelLoaded">
    <customForm :propID="id" :modulename="modulename" :moduleurl="moduleurl"> </customForm>
    </template>
  </div>
</template>
<script>
import customForm from '../../containers/form/form'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'testform',
  components: {
    customForm
  },
  data () {
    return {
      id: null,
      modulename: 'roles',
      moduleurl: 'admin/roles'
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    next()
  },
  mounted () {
    this.getSchemaVuex('28ca109d-4939-4ca4-bed0-f5fd1a11bdf2')
    this.getModelVuex()
    // this.getSchema()
    // this.getData()
  },
  computed: {
    ...mapState({
      schemaLoaded: state => state.form.schemaLoaded,
      modelLoaded (state) {
        return state[this.modulename].modelLoaded
      }
    })
  },
  methods: {
    ...mapActions({
      getSchemaVuex (dispatch, payload) {
        return dispatch('form/getSchema', payload)
      },
      getModelVuex (dispatch, payload) {
        return dispatch(this.modulename + '/getModel', payload)
      }
    })
  }
}
</script>

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
  name: 'userform',
  components: {
    customForm
  },
  data () {
    return {
      id: null,
      modulename: 'users',
      moduleurl: 'admin/users'
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    next()
  },
  mounted () {
    this.getSchemaVuex('a98c0acd-ff66-482a-a8be-3f9be3c92e88')
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

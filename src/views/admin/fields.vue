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
      modulename: 'fields',
      moduleurl: 'admin/fields'
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    next()
  },
  mounted () {
    this.getSchemaVuex('2c202af7-9404-447c-b38c-04fabeacdcfc')
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

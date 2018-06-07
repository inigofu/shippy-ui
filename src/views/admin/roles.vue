template>
  <div class="wrapper">
    <template v-if="schemaLoaded">
    <customForm :propID="id" :modulename="modulename"> </customForm>
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
      modulename: 'forms',
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
    this.getSchemaVuex('44e75d5d-13ac-44a8-a46c-dc4bcdef80bd')
    this.getModelVuex()
    // this.getSchema()
    // this.getData()
  },
  computed: {
    ...mapState({
      schemaLoaded: state => state.forms.schemaLoaded
    })
  },
  methods: {
    ...mapActions({
      getSchemaVuex: 'forms/getSchema',
      getModelVuex: 'forms/getModel'
    })
  }
}
</script>

<template>
  <b-modal title="Grid designer" :size="'800'" :visible="gridModal" @ok="handleOk" @hidden="handleClose">
    <template v-if="dataLoaded">
        <b-carousel id="carousel1"
                        style="text-shadow: 1px 1px 2px #333;"
                        controls
                        indicators
                        background="#ababab"
                        :interval="0"
                        v-model="slide"
                        class="application-frame"
                        img-blank
                        img-height="650"
            >

            <!-- Text slides with image -->
            <b-carousel-slide :caption="schema.name">
                <griddesigner  :schema="schema" @input="updateGrid"/>
            </b-carousel-slide>
            <!-- Slides with custom text -->
            <b-carousel-slide v-for="(tab,index) in tabs" :key="index" :caption="'Tab-' + tab.name" >
                <griddesigner  :schema="tab" @input="updateTabs($event,index)"/>
            </b-carousel-slide>
            </b-carousel>
    </template>
  </b-modal>
</template>

<script>
import griddesigner from './gridDesigner'
import { mapState, mapActions } from 'vuex'
import {clone} from 'lodash'

export default {
  name: 'gridcarrusel',
  props: {
    gridModal: {
      type: Boolean,
      default: false
    },
    modulename: null,
    moduleurl: null
  },
  watch: {
    schema (newSchema, oldSchema) {
      this.grid = clone(newSchema)
      this.tabs = clone(newSchema.tabs)
    }
  },
  created () {
    this.grid = clone(this.schema)
    this.tabs = clone(this.schema.tabs)
    this.dataLoaded = true
  },
  data () {
    return {
      grid: Object,
      tabs: Array,
      slide: 0,
      dataLoaded: false,
      tempSchema: null
    }
  },
  components: {
    griddesigner
  },
  computed: {
    ...mapState({
      schema: state => state.form.schema
    })
  },
  methods: {
    ...mapActions({
      setSchema: 'form/saveLayout'
    }),
    updateGrid (e) {
      this.grid = e
    },
    updateTabs (e, index) {
      this.tabs[index] = e
    },
    handleClose (evt) {
      this.$emit('close', false)
    },
    handleOk (evt) {
      // Prevent modal from closing
      // evt.preventDefault()
      let input = {}
      if (this.grid.groups.length === 1) {
        input = this.grid.groups[0]
        input.id = this.schema.id
        input.name = this.schema.name
        input.tabs = this.tabs
      } else {
        input = this.grid
      }
      for (let i = 0; i < input.tabs.length; i++) {
        if (input.tabs[i].groups.length === 1) {
          let input2 = {}
          input2 = input.tabs[i].groups[0]
          input2.id = input.tabs[i].id
          input2.name = input.tabs[i].name
          input.tabs[i] = input2
        }
      }
      this.setSchema(input)
        .then(response => { this.$router.push('/' + this.moduleurl + '/' + response) })
        .catch(response => {
          console.log(response)
        })
    }
  }
}
</script>
<style>
  .carousel-item {
    min-width: 1170px;
    min-height: 670px;
  }
  .carousel-control-prev{
    width: 50px
  }
  .carousel-caption {
      left: 50px
  }
  .carousel-control-next {
      width: 50px
  }
</style>

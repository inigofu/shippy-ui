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
                <griddesigner  :schema="schema" v-model="grid"/>
            </b-carousel-slide>
            <!-- Slides with custom text -->
            <b-carousel-slide v-for="(tab,index) in schema.tabs" :key="index" :caption="'Tab-' + tab.name">
                <griddesigner  :schema="tab" v-model="tabs[index]"/>
            </b-carousel-slide>
            </b-carousel>
    </template>
  </b-modal>
</template>

<script>
import griddesigner from './gridDesigner'
export default {
  name: 'gridcarrusel',
  props: {
    schema: Object,
    gridModal: {
      type: Boolean,
      default: false
    }
  },
  created () {
    console.log('created carrusel', this.schema)
    this.grid = this.schema
    this.tabs = this.schema.tabs
    this.dataLoaded = true
  },
  data () {
    return {
      grid: Object,
      tabs: Array,
      slide: 0,
      dataLoaded: false
    }
  },
  components: {
    griddesigner
  },
  methods: {
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
        let input2 = {}
        input2 = input.tabs[i].groups[0]
        input2.id = input.tabs[i].id
        input2.name = input.tabs[i].name
        this.$http.post('/rpc', {
          request: input2,
          service: 'shippy.auth',
          method: 'Auth.UpdateForm'
        })
          .then(({ data }) => {
            console.log(data.form)
          }).catch((error) => {
            throw error
          })
      }
      this.$http.post('/rpc', {
        request: input,
        service: 'shippy.auth',
        method: 'Auth.UpdateForm'
      })
        .then(({ data }) => {
          console.log(data.form)
        }).catch((error) => {
          throw error
        })
      this.$emit('input', input)
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

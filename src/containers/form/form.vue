<template>
<multipane class="custom-resizer container" v-resize="onResize" layout="vertical" v-on:paneResize="paneResizeStop">
  <div v-bind:class="[model ? 'd-none d-lg-block' : '' ,'pane']" v-bind:style="{minWidth: '20%' , width: panWidth}">
    <data-table :rows="rows" :fields="fields" :selected="selected" :select="selectRow" :stacked="stacked"></data-table>
  </div>
  <multipane-resizer v-bind:class="[model ? 'd-none d-lg-block' : '']"></multipane-resizer>
  <div v-bind:class="[model ? '' : 'd-none d-lg-block' ,'pane']" :style="{ flexGrow: 1, maxWidth:'100%', width: '20%' }">
    <div class="horizontal-panes">
      <div class="control-buttons text-center">
        <button @click="newModel" class="btn btn-default new"> <i class="fa fa-plus"></i>New</button>
        <button @click="saveModel" class="btn btn-primary save"> <i class="fa fa-floppy-o"></i>Save<i v-if="showWarning()" class="fa fa-warning"></i></button>
        <button @click="deleteModel" class="btn btn-danger delete"> <i class="fa fa-trash"></i>Delete</button>
      </div>
      <div class="errors text-center">
        <div v-for="(item, index) in validationErrors" :key=index track-by="index" class="alert alert-danger">{{ item.field.label}}: <strong>{{ item.error }}</strong></div>
      </div>
      <vue-form-generator :schema="schema" :model="model" :options="formOptions" :multiple="selected.length > 1" ref="form" :is-new-model="isNewModel" @model-updated="modelUpdated" @validated="onValidated"></vue-form-generator>
    </div>
    <div class="horizontal-panes">
      <b-tabs >
        <b-tab v-for="tab in schematabs"  :key="tab.id" v-bind:title= "tab.tabs.name">
          <vue-form-generator-table :schema="tab.tabs" :model="tab.model" :options="formOptions" :multiple="selected.length > 1" :is-new-model="isNewModel"></vue-form-generator-table>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</multipane>
</template>

<script>
import Vue from 'vue'
import VueFormGenerator from '../../components/formGenerator/formGenerator.vue'
import VueFormGeneratorTable from '../../components/formGenerator/formGeneratorTable.vue'
import { Multipane, MultipaneResizer } from '../../components/multipane'
import DataTable from './dataTable.vue'
import Schema from './schema'
import { filters } from './utils'
import { isFunction, isArray, set, get, each, cloneDeep, isObject, merge } from 'lodash'
import FieldAwesome from './fieldAwesome.vue'
import Multiselect from 'vue-multiselect'
import resize from 'vue-resize-directive'

Vue.component('multiselect', Multiselect)

// Test custom field

Vue.component('fieldAwesome', FieldAwesome)

// Vue.use(VueFormGenerator)

export default {
  components: {
    DataTable,
    VueFormGenerator,
    Multipane,
    MultipaneResizer,
    VueFormGeneratorTable
  },
  directives: {
    resize
  },
  filters: filters,
  props: [
    'propID',
    'schema',
    'fields',
    'rows'
  ],
  data () {
    return {
      isNewModel: false,

      selected: [],
      stacked: true,
      panWidth: '20%',

      model: null,
      schema2: Schema,
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateBeforeSave: true
      }
    }
  },

  computed: {
    validationErrors () {
      if (this.$refs.form && this.$refs.form.errors) { return this.$refs.form.errors }

      return []
    },
    id () {
      return this.propID
    },
    schematabs () {
      if (this.schema.tabs !== undefined && this.model !== null) {
        return this.schema.tabs.map(function (tab, index, array) {
          return {
            tabs: tab,
            model: this.model[tab.name],
            modelstring: 'this.model.' + tab.name
          }
        }, this)
      } else if (this.schema.tabs !== undefined) {
        return this.schema.tabs.map(function (tab, index, array) {
          return {
            tabs: tab,
            model: {},
            modelstring: {}
          }
        }, this)
      } else {
        return []
      }
    }
  },
  watch: {
    id: function (newId, oldId) {
      var row = this.rows.filter((p) => {
        return p.id === newId
      })
      this.clearSelection()
      console.log('row', row)
      this.selected.push(row[0])
      // }
      this.generateModel()
    }
  },
  methods: {
    onResize (event) {
      if (document.documentElement.clientWidth < 991.98) {
        this.panWidth = '100%'
      } else {
        this.panWidth = '20%'
      }
    },
    showWarning () {
      if (this.$refs.form && this.$refs.form.errors) {
        return this.$refs.form.errors.length > 0
      }
    },

    selectRow (record, id) {
      this.isNewModel = false
      /* if ((add || (event && event.ctrlKey))) {
        if (this.selected.indexOf(row) !== -1) {
          var index = this.selected.indexOf(row)
          this.selected.splice(index, 1)
        } else {
          this.selected.push(row)
        }
      } else { */
      this.$router.push('/form/' + record.id)
    },

    clearSelection () {
      this.selected.splice(0)
      this.generateModel()
    },

    onValidated (res, errors) {
      console.log('VFG validated:', res, errors)
    },

    generateModel () {
      if (this.selected.length === 1) {
        this.model = cloneDeep(this.selected[0])
        console.log('this.model', this.model)
      } else if (this.selected.length > 1) {
        this.model = this.mergeMultiObjectFields(Schema, this.selected)
      } else {
        this.model = null
      }
    },
    newModel () {
      console.log('Create new model...')
      this.selected.splice(0)
      console.log(VueFormGenerator)
      let newRow = this.createDefaultObject(Schema, { id: this.getNextID() })
      this.isNewModel = true
      this.model = newRow

      let el = document.querySelector('div.form input:nth-child(1):not([readonly]):not(:disabled)')
      if (el) { el.focus() }
    },

    saveModel () {
      console.log('Save model...')
      if (this.formOptions.validateBeforeSave === false || this.validate()) {
        this.mergeModelValues()

        if (this.isNewModel) {
          this.rows.push(this.model)
          this.selectRow(null, this.model, false)
          this.$emit('addModelEvent', this.model)
        } else {
          this.$emit('saveModelEvent', this.model)
        }
      } else {
        console.warn('Error saving model...')
        // Validation error
      }
    },

    mergeModelValues () {
      let model = this.model
      if (model && this.selected.length > 0) {
        each(this.selected, (row) => {
          merge(row, model)
        })
      }
    },

    deleteModel () {
      if (this.selected.length > 0) {
        each(this.selected, (row) => {
          let index = this.rows.indexOf(row)
          this.rows.splice(index, 1)
        })
        this.clearSelection()
      }
    },

    getNextID () {
      let id = 0

      each(this.rows, (row) => {
        if (row.id > id) { id = row.id }
      })

      return ++id
    },

    validate () {
      console.log('validate', this.$refs.form, this.$refs.form.validate())
      return this.$refs.form.validate()
    },

    modelUpdated (newVal, schema) {
      console.log('main model has updated', newVal, schema)
    },

    getLocation (model) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          if (!model.address) { model.address = {} }
          if (!model.address.geo) { model.address.geo = {} }
          model.address.geo.latitude = pos.coords.latitude.toFixed(5)
          model.address.geo.longitude = pos.coords.longitude.toFixed(5)
        })
      } else {
        alert('Geolocation is not supported by this browser.')
      }
    },
    paneResizeStop (pane, resizer, size) {
      console.log(Number(size.replace('%', '')))
      if (Number(size.replace('%', '')) < 25) {
        this.stacked = true
      } else {
        this.stacked = false
      }
    },
    // Create a new model by schema default values
    createDefaultObject (schema, obj = {}) {
      each(schema.fields, (field) => {
        if (get(obj, field.model) === undefined && field.default !== undefined) {
          if (isFunction(field.default)) {
            set(obj, field.model, field.default(field, schema, obj))
          } else if (isObject(field.default) || isArray(field.default)) {
            set(obj, field.model, cloneDeep(field.default))
          } else {
            set(obj, field.model, field.default)
          }
        }
      })
      return obj
    },
    // Get a new model which contains only properties of multi-edit fields
    getMultipleFields (schema) {
      let res = []
      each(schema.fields, (field) => {
        if (field.multi === true) {
          res.push(field)
        }
      })

      return res
    },
    // Merge many models to one 'work model' by schema
    mergeMultiObjectFields (schema, objs) {
      let model = {}

      let fields = this.getMultipleFields(schema)

      each(fields, (field) => {
        let mergedValue
        let notSet = true
        let path = field.model

        each(objs, (obj) => {
          let v = get(obj, path)
          if (notSet) {
            mergedValue = v
            notSet = false
          } else if (mergedValue !== v) {
            mergedValue = undefined
          }
        })

        set(model, path, mergedValue)
      })

      return model
    }
  },

  mounted () {
    // this.rows = users.users()
    if (document.documentElement.clientWidth < 991.98) {
      this.panWidth = '100%'
    } else {
      this.panWidth = '20%'
    }
  }
}

window.Vue = require('vue')
</script>

<style lang="scss">
  @import "~bootstrap/scss/bootstrap-grid.scss";
  html {    font-family: "Open Sans";    font-size: 14px;  }

  * {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  pre {
    overflow: auto;

    .string { color: #885800; }
    .number { color: blue; }
    .boolean { color: magenta; }
    .null { color: red; }
    .key { color: green; }
  }

  .control-buttons {
    button {
      margin: 0.2em 0.3em;
      padding: 6px 20px;
      position: relative;

      i {
        margin-right: 0.3em;
      }
    }

    i.fa.fa-warning {
      position: absolute;
      top: 0px;
      right: 0px;
      color: Orange;
    }
  }

  .errors {
    .alert {
      padding: 4px;
      width: 80%;
      margin: 5px auto;
    }
  }

  fieldset.vue-form-generator {

    .form-group.half-width {
      width: 50%;
    }

    .half-width + .half-width {
      &:not(.first) {
        padding-left: 0.5rem;
      }
    }

  }
  .custom-resizer {
  width: 100%;
  height: calc(100vh - 165px);
}
.custom-resizer > .pane {
  text-align: left;
  overflow: hidden;
  background: #eee;
  border: 1px solid #ccc;
  overflow-y:auto;
}
.custom-resizer > .pane ~ .pane {
}
.custom-resizer > .multipane-resizer {
  margin: 0; left: 0;
  position: relative;
  border: 1px solid #ccc;
  &:hover {
    &:before {
      border-color: #999;
    }
  }
}
.horizontal-panes {
  width: 100%;
  padding: 15px;
}

</style>

<template>
<div class="wrapper">
<multipane class="custom-resizer" v-resize="onResize" layout="vertical" v-on:paneResize="paneResizeStop">
  <div v-bind:class="[model ? 'd-none d-lg-block' : '' ,'']" v-bind:style="{minWidth: '20%' , width: panWidth}">
    <b-form-group horizontal label="Filter" class="mb-0">
      <b-input-group>
        <b-form-input v-model="filter" placeholder="Type to Search" />
        <b-input-group-append>
          <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <div class='tablepane'>
      <data-table :rows="rows" :fields="fields" :select="selectRow" :stacked="stacked" :filter="filter"></data-table>
    </div>
  </div>
  <multipane-resizer class="d-none d-lg-block"></multipane-resizer>
  <div v-bind:class="[model ? '' : 'd-none d-lg-block' ,'pane']" :style="{ flexGrow: 1, maxWidth:'100%', width: '20%' }">
    <div>
      <div class="control-buttons text-center">
        <b-button @click="newModel" class="btn btn-default new"> <i class="fa fa-plus"></i>New</b-button>
        <b-button @click="saveModel" class="btn btn-primary save"> <i class="fa fa-floppy-o"></i>Save<i v-if="showWarning()" class="fa fa-warning"></i></b-button>
        <b-button @click="deleteModel" class="btn btn-danger delete"> <i class="fa fa-trash"></i>Delete</b-button>
        <b-button v-if="$can('update', 'griddesigner')" type="button" variant="info" @click="gridModalShow">Grid designer</b-button>
      </div>
      <div class="errors text-center">
        <div v-for="(item, index) in errors" :key=index track-by="index" class="alert alert-danger">{{ item.field.label}}: <strong>{{ item.error }}</strong></div>
      </div>
      <vue-form-generator :schema="schema" :model="model" :options="formOptions" ref="form" :is-new-model="isNewModel" @validated="onValidated('form',...arguments)"></vue-form-generator>
    </div>
    <div>
      <b-tabs >
        <b-tab v-for="(tab,index) in schematabs"  :key="tab.tabs.id" v-bind:title= "tab.tabs.name">
          <div class="control-buttons text-center">
            <b-button v-if="tab.tabs.multiline" @click="newLine(tab.tabs.name, index)" class="btn btn-default new"> <i class="fa fa-plus"></i>New line</b-button>
          </div>
          <vue-form-generator-table v-if="tab.tabs.multiline" :index="index" :model="tab.model" :name="tab.tabs.name" :parentid="id" :modulename="modulename" :options="formOptions" :is-new-model="isNewModel" @validated="onValidated(tab.tabs.name,...arguments)"></vue-form-generator-table>
          <vue-form-generator v-if="isNotMultiline(tab.tabs.multiline)" :schema="tab.tabs" :index="index" :model="tab.model" :name="tab.tabs.name" :parentid="id" :modulename="modulename" :options="formOptions" :is-new-model="isNewModel" @validated="onValidated(tab.tabs.name,...arguments)"></vue-form-generator>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</multipane>
<gridcarrusel  :gridModal="gridModal" @close="handleClose" :modulename="modulename" :moduleurl="moduleurl" />
<b-modal ref="beforegridModal">
    Hello From My Modal!
</b-modal>
</div>
</template>

<script>
import Vue from 'vue'
import { mapState, mapActions } from 'vuex'
import VueFormGenerator from '../../components/formGenerator/formGenerator.vue'
import gridcarrusel from '../../components/formGenerator/gridCarrusel.vue'
import VueFormGeneratorTable from '../../components/formGenerator/formGeneratorTable.vue'
import { Multipane, MultipaneResizer } from '../../components/multipane'
import DataTable from './dataTable.vue'
import { filters } from './utils'
import { isFunction, isArray, set, get, each, cloneDeep, isObject } from 'lodash'
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
    VueFormGeneratorTable,
    gridcarrusel
  },
  directives: {
    resize
  },
  filters: filters,
  props: [
    'propID',
    'modulename',
    'moduleurl'
    // 'schema',
    // 'fields',
    // 'rows'
  ],
  data () {
    return {
      isNewModel: false,
      stacked: true,
      panWidth: '20%',
      changed: false,
      rowSelected: false,
      model: null,
      gridModal: false,
      schemaCopia: this.schema,
      filter: null,
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateBeforeSave: true
      },
      errors: []
    }
  },
  computed: {
    ...mapState({
      schema: state => state.form.schema,
      rows (state) {
        return state[this.modulename].rows
      },
      fields (state) {
        return state[this.modulename].fields
      }
    }),
    id () {
      return this.propID
    },
    schematabs () {
      if (this.schema.tabs !== undefined && this.model !== null && this.model !== undefined) {
        return this.schema.tabs.map(function (tab, index, array) {
          console.log('schematabs', tab.name, this.model[tab.name])
          if (this.model[tab.name] !== undefined) {
            return {
              tabs: tab,
              model: this.model[tab.name],
              modelstring: 'this.model.' + tab.name
            }
          } else if (tab.multiline === false || tab.multiline === undefined) {
            let newRow = this.createDefaultObject(tab, { id: '1' })
            Vue.set(this.model, tab.name, newRow)
            return {
              tabs: tab,
              model: newRow,
              modelstring: 'this.model.' + tab.name
            }
          } else {
            return {
              tabs: tab,
              model: null,
              modelstring: 'this.model.' + tab.name
            }
          }
        }, this)
      } else if (this.schema.tabs !== undefined) {
        return this.schema.tabs.map(function (tab, index, array) {
          return {
            tabs: tab,
            model: null,
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
      if (newId === 'new') {
        let newRow = this.createDefaultObject(this.schema)
        this.isNewModel = true
        this.model = newRow
        let el = document.querySelector('div.form input:nth-child(1):not([readonly]):not(:disabled)')
        if (el) { el.focus() }
      } else {
        var row = this.rows.filter((p) => {
          return p.id === newId
        })
        this.isNewModel = false
        this.model = cloneDeep(row[0])
      }
    }
  },
  methods: {
    ...mapActions({
      saveModelVuex (dispatch, payload) {
        return dispatch(this.modulename + '/saveModel', payload)
      },
      addModelVuex (dispatch, payload) {
        return dispatch(this.modulename + '/addModel', payload)
      },
      deleteModelVuex (dispatch, payload) {
        return dispatch(this.modulename + '/deleteModel', payload)
      }
    }),
    isNotMultiline (multiline) {
      if (multiline === undefined || multiline === false) {
        return true
      } else {
        return false
      }
    },
    handleClose (status) {
      this.gridModal = status
    },
    gridModalShow () {
      if (this.changed) {
        this.$refs.beforegridModal.show()
      } else {
        this.gridModal = true
      }
    },
    onResize (event) {
      if (document.documentElement.clientWidth < 991.98) {
        this.panWidth = '100%'
      } else {
        this.panWidth = '20%'
      }
    },
    showWarning () {
      return this.errors.length > 0
    },

    selectRow (record, id) {
      this.isNewModel = false
      this.rowSelected = true
      this.changed = false
      this.$router.push('/' + this.moduleurl + '/' + record.id)
    },
    onValidated (name, res, errors) {
      console.log('onValidated', res, errors, name)
      this.errors = this.errors.filter(function (el) { return el.name !== name })
      if (!res) {
        let temp = errors.map(function (error, index, array) {
          return {error: error.error,
            field: error.field,
            name: name}
        })
        each(temp, (err) => {
          this.errors.push(err)
        })
      }
      console.log('VFG validated:', res, errors)
    },
    newModel () {
      this.$router.push('/' + this.moduleurl + '/new')
    },
    newLine (tabid, tabindex) {
      let newRow = this.createDefaultObject(this.schema.tabs[tabindex], { id: '1' })
      if (this.model[tabid] === undefined || this.model[tabid] === null) {
        Vue.set(this.model, tabid, [newRow])
      } else {
        this.model[tabid].push(newRow)
      }
    },
    saveModel () {
      if (this.formOptions.validateBeforeSave === false || this.validate()) {
        if (this.isNewModel) {
          this.addModelVuex(this.model)
            .then(response => { this.$router.push('/' + this.moduleurl + '/' + response) })
            .catch(response => {
              // fail
            })
        } else {
          this.saveModelVuex(this.model)
        }
      } else {
        console.warn('Error saving model...')
        // Validation error
      }
    },
    deleteModel () {
      this.deleteModelVuex(this.model)
        .then(response => { this.$router.push('/' + this.moduleurl + '/' + this.rows[response].id) })
        .catch(response => {
          // fail
        })
    },
    getNextID () {
      let id = 0
      each(this.rows, (row) => {
        if (row.id > id) { id = row.id }
      })

      return ++id
    },
    validate () {
      return this.$refs.form.validate()
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
      let i = 0
      if (obj.groups === undefined) {
        obj.groups = []
      }
      each(schema.groups, (group) => {
        each(group.fields, (field) => {
          if (get(obj.groups[i], field.model) === undefined && field.default !== undefined) {
            if (isFunction(field.default)) {
              set(obj.groups[i], field.model, field.default(field, schema, obj))
            } else if (isObject(field.default) || isArray(field.default)) {
              set(obj.groups[i], field.model, cloneDeep(field.default))
            } else {
              set(obj, field.model, field.default)
            }
          }
        })
        i++
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
  .modal-800 {
    width: 1300px;
    margin: 30px auto;
    max-width: 1300px;
}
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
.tablepane {
  text-align: left;
  overflow: hidden;
  background: #eee;
  border: 1px solid #ccc;
  overflow-y:auto;
  position: relative;
  height: calc(100% - 35px);
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

<template lang="pug">
  select.form-control(v-model="value", :disabled="disabled", :name="schema.inputName", :id="getFieldID(schema)", :class="schema.fieldClasses")
    option(v-if="!selectOptions.hideNoneSelectedText", :disabled="schema.required", :value="null") {{ selectOptions.noneSelectedText || "&ltNothing selected&gt" }}

    template(v-for="item in items")
      optgroup(v-if="item.group", :label="getGroupName(item)")
        option(v-if="item.ops", v-for="i in item.ops", :value="getItemValue(i)") {{ getItemName(i) }}

      option(v-if="!item.group", :value="getItemValue(item)") {{ getItemName(item) }}
</template>

<script>
import {isObject, isNil, find} from 'lodash'
import abstractField from '../abstractField'

export default {
  mixins: [ abstractField ],

  computed: {
    selectOptions () {
      return this.schema.selectOptions || {}
    },

    items () {
      let values = this.schema.values
      if (values !== undefined && typeof (values) === 'function') {
        return this.groupValues(values.apply(this, [this.model, this.schema]))
      } else if (values !== undefined) {
        return this.groupValues(values)
      }
    }
  },

  methods: {
    formatValueToField (value) {
      if (isNil(value)) {
        return null
      }
      return value
    },

    groupValues (values) {
      let array = []
      let arrayElement = {}

      values.forEach((item) => {
        arrayElement = null

        if (item.group && isObject(item)) {
          // There is in a group.

          // Find element with this group.
          arrayElement = find(array, i => i.group === item.group)

          if (arrayElement) {
            // There is such a group.

            arrayElement.ops.push({
              id: item.id,
              value: item.value
            })
          } else {
            // There is not such a group.

            // Initialising.
            arrayElement = {
              group: '',
              ops: []
            }

            // Set group.
            arrayElement.group = item.group

            // Set Group element.
            arrayElement.ops.push({
              id: item.id,
              value: item.value
            })

            // Add array.
            array.push(arrayElement)
          }
        } else {
          // There is not in a group.
          array.push(item)
        }
      })

      // With Groups.
      return array
    },

    getGroupName (item) {
      if (item && item.group) {
        return item.group
      }
      var err = 'Group name is missing! https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items'
      throw err
    },

    getItemValue (item) {
      if (isObject(item)) {
        if (typeof this.schema['selectOptions'] !== 'undefined' && typeof this.schema['selectOptions']['value'] !== 'undefined') {
          return item[this.schema.selectOptions.value]
        } else {
          // Use 'id' instead of 'value' cause of backward compatibility
          if (typeof item['id'] !== 'undefined') {
            return item.id
          } else {
            var err = '`id` is not defined. If you want to use another key name, add a `value` property under `selectOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items'
            throw err
          }
        }
      } else {
        return item
      }
    },

    getItemName (item) {
      if (isObject(item)) {
        if (typeof this.schema['selectOptions'] !== 'undefined' && typeof this.schema['selectOptions']['name'] !== 'undefined') {
          return item[this.schema.selectOptions.name]
        } else {
          if (typeof item['value'] !== 'undefined') {
            return item.value
          } else {
            var err = '`name` is not defined. If you want to use another key name, add a `name` property under `selectOptions` in the schema. https://icebob.gitbooks.io/vueformgenerator/content/fields/select.html#select-field-with-object-items'
            throw err
          }
        }
      } else {
        return item
      }
    }
  }
}
</script>

<style lang="scss">
</style>

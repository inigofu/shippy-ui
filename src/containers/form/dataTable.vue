<template >
  <b-table id="tabladatos" v-bind:stacked="stacked" hover :items="rows" :fields="fields" v-on:row-clicked="select" >
  </b-table>
</template>

<script>

import { find } from 'lodash'
import roles from './data'

export default {
  props: [
    'rows',
    'selected',
    'select',
    'fields',
    'stacked'
  ],
  methods: {
    isSelected (row) {
      return this.selected.indexOf(row) !== -1
    },
    getRoleName (row) {
      let role = find(roles, role => role.id === row.role)
      return role ? role.name : ''
    }
  }
}
</script>

<style lang="scss" scoped>

  .table {
    tr {
      cursor: pointer;

      td {
        img {
          width: 32px;
          height: 32px;
          border-radius: 100%;
          margin-right: 0.4em;
        }
      }
    }
  }

</style>

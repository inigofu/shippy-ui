<template >
  <b-table id="tabladatos" v-bind:stacked="stacked" hover :items="rows" :fields="fields" :filter="filter" v-on:row-clicked="select" >
  </b-table>
</template>

<script>

export default {
  props: [
    'rows',
    'select',
    'fields',
    'stacked',
    'filter'
  ]
}
</script>

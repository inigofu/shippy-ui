<template >
  <b-table id="tabladatos" v-bind:stacked="stacked" hover :items="rows" :fields="fields" v-on:row-clicked="select" >
  </b-table>
</template>

<script>

export default {
  props: [
    'rows',
    'select',
    'fields',
    'stacked'
  ]
}
</script>

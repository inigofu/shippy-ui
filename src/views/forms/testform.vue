<template>
  <div class="wrapper">
    <customForm :propID="id"> </customForm>
  </div>
</template>
<script>
import customForm from '../../containers/form/form'

export default {
  name: 'testform',
  components: {
    customForm
  },
  data () {
    return {
      id: null
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.id = to.params.id
    next()
  }
}
</script>

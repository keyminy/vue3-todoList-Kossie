<template>
  <div
      v-for="(item,idx) in items" 
      :key="item.id"
      class="card mt-2"
  >
    <slot :item="item" :idx="idx"></slot>
  </div>
</template>

<script>
export default {
  props : {
    items : {
      type : Array,
      required : true
    }
  },
  setup () {
    

    return {}
  }
}
</script>

<style lang="scss" scoped>

</style>
<template>
  <h1>To-Do Page</h1>
  <TodoFormVue :editing="true"/>
</template>

<script>
import TodoFormVue from '@/components/TodoForm.vue';

export default {
  components : {
    TodoFormVue
  }
}
</script>

<style lang="scss" scoped>

</style>
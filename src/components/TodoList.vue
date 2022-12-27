<template>
  <div
    v-for="(todo,idx) in todos" 
    :key="todo.id"
    class="card mt-2"
  >
    <div class="card-body p-2 d-flex align-items-center">
      <!--여기서 flex-grow-1하면 Delete버튼이 맨 오른쪽으로 가게-->
      <div class="form-check flex-grow-1">
        <input 
          class="form-check-input"
          type="checkbox"
          :value="todo.completed"
          @change="toggleTodo(idx)"
        >
        <label 
          class="form-check-label"
          :class="{todo : todo.completed}">
          {{todo.subject}}
        </label>
      </div>
      <div>
        <button 
          class="btn btn-danger btn-sm"
          @click="deleteTodo(idx)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todos : {
      tpye: Array,
      required: true
    }
  },
  setup (props,context) {
    const toggleTodo = (idx) => {
      //idx를 부모컴포넌트로 보내준다.
      context.emit('toggle-todo',idx);
      
    }
    return {
      toggleTodo
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
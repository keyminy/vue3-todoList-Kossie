<template>
  <div
    v-for="(todo,idx) in todos" 
    :key="todo.id"
    class="card mt-2"
  >
    <div
      class="card-body p-2 d-flex align-items-center"
      style="cursor : pointer"
      @click="moveToPage(todo.id)"
    >
      <!--여기서 flex-grow-1하면 Delete버튼이 맨 오른쪽으로 가게-->
      <div class="form-check flex-grow-1">
        <input 
          class="form-check-input"
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(idx, $event)"
          @click.stop
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
          @click.stop="deleteTodo(idx)">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  props: {
    todos : {
      tpye: Array,
      required: true
    }
  },
  emits:['toggle-todo','delete-todo'],
  setup (props,{emit}) {
    const router = useRouter();

    const toggleTodo = (idx,event) => {
      //idx를 부모컴포넌트로 보내준다.
      emit('toggle-todo',idx,event.target.checked);
    }
    //App.vue부모컴포넌트에 idx값 전달
    const deleteTodo = (idx) => {
      emit('delete-todo',idx);
    };

    const moveToPage = (todoId) => {
      console.log(todoId);
      router.push({
        name:'Todo',
        params:{id:todoId}
      });
    }

    return {
      toggleTodo,
      deleteTodo,
      moveToPage
    }
  }
}
</script>

<style scoped>
  .todo {
    color:gray;
    text-decoration: line-through;
  }
</style>
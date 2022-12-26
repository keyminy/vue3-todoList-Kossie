<template>
  <div class="container">
    <h2>To-Do List</h2>
    <TodoSimpleFormVue @add-todo="addTodo"/>
    <div v-if="!todos.length">
      추가된 Todo가 없습니다.
    </div>
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
            v-model="todo.completed"
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
  </div>
</template>

<script>
import {ref} from 'vue';
import TodoSimpleFormVue from './components/TodoSimpleForm.vue';

export default {
  components : {
    TodoSimpleFormVue
  },
  setup () {

    const todos = ref([
    ]);

    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    };
    /* 자식(TodoSimpleForm.vue)로 부터 추가된 TodoList {}값
    을 받아서 추가해준다. */
    const addTodo = (todo) => {
      todos.value.push(todo);
    }
    /* //emit을 안썼을때 방식
        todos.value.push({
          id: Date.now(),
          subject : todo.value,
          completed : false,
        });
    */
    

    const deleteTodo = (idx) => {
      todos.value.splice(idx,1);
    }

    return {
      todos,
      todoStyle,
      addTodo,
      deleteTodo
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
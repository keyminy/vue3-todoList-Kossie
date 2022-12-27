<template>
  <div class="container">
    <h2>To-Do List</h2>
    <TodoSimpleFormVue @add-todo="addTodo"/>
    <div v-if="!todos.length">
      추가된 Todo가 없습니다.
    </div>
    <TodoListVue 
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"  
    />
  </div>
</template>

<script>
import {ref} from 'vue';
import TodoSimpleFormVue from './components/TodoSimpleForm.vue';
import TodoListVue from './components/TodoList.vue';

export default {
  components : {
    TodoSimpleFormVue,
    TodoListVue
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
    
    const toggleTodo = (idx) => {
      console.log('전 : ',todos.value[idx]);
      todos.value[idx].completed = !todos.value[idx].completed;
      console.log('후 : ',todos.value[idx]);
    };

    const deleteTodo = (idx) => {
      todos.value.splice(idx,1);
    }

    return {
      todos,
      todoStyle,
      addTodo,
      deleteTodo,
      toggleTodo
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
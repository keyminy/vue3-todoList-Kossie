<template>
  <div class="container">
    <h2>To-Do List</h2>
    <form 
      @submit.prevent="onSubmit">
      <div class="d-flex">
        <div class="flex-grow-1 mr-2">
          <input 
          class="form-control"
          type="text" 
          v-model="todo"
          placeholder="Type new to-do"
          >
        </div>
        <div>
          <button 
            class="btn btn-primary" 
            type="submit"
          >Add</button>
        </div>
      </div>
      <div v-show="hasError" style="color:tomato">
        This field cannot be empty!!
      </div>
    </form>
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

export default {
  setup () {
    const todo = ref('');
    const todos = ref([
    ]);
    const hasError = ref(false);
    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    };
    const onSubmit = () => {
      if(todo.value === ''){
        hasError.value = true;
      }else{
        //input창에 값을 입력한 경우니까 push
        todos.value.push({
          id: Date.now(),
          subject : todo.value,
          completed : false,
        });
        //잘 추가가 됬으면 에러메시지 없애주기
        hasError.value = false;
        //input값 초기화
        todo.value = '';
      }
    }

    const deleteTodo = (idx) => {
      todos.value.splice(idx,1);
    }

    return {
      todo,
      todos,
      onSubmit,
      hasError,
      todoStyle,
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
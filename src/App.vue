<template>
  <div class="container">
    <h2>To-Do List</h2>
    <input 
        class="form-control"
        type="text" 
        v-model="searchText"
        placeholder="Search"
    >
    <hr/>
    <TodoSimpleFormVue @add-todo="addTodo"/>
    <div style="color: tomato">{{ error }}</div>
    <div v-if="!filteredTodos.length">
      추가된 Todo가 없습니다.
    </div>
    <TodoListVue 
      :todos="filteredTodos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"  
    />
  </div>
</template>

<script>
import {ref,computed} from 'vue';
import TodoSimpleFormVue from './components/TodoSimpleForm.vue';
import TodoListVue from './components/TodoList.vue';
import axios from 'axios';

export default {
  components : {
    TodoSimpleFormVue,
    TodoListVue
  },
  setup () {

    const todos = ref([]);
    const error = ref('');

    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    };
    /* 자식(TodoSimpleForm.vue)로 부터 추가된 TodoList {}값
    을 받아서 추가해준다. */
    const addTodo = (todo) => {
      error.value = '';
      //DB에 todo를 저장
      //axios 2번째 인자 : 보낼 데이터(id는 AI값 자동)
      axios.post('http://localhost:3000/todos',{
        subject : todo.subject,
        completed : todo.completed,
      }).then(res => {
        console.log(res);
        todos.value.push(res.data);
      }).catch(err => {
        console.log(err);
        error.value = 'Something went wrong';
      }); 
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

    const searchText = ref('');
    const filteredTodos = computed(()=>{
      if(searchText.value){
        //검색결과가 있으면,filter된 [] Array리턴
        return todos.value.filter(todo => {
          return todo.subject.includes(searchText.value);
        });
      }
      //검색결과가 없다면 기존의 [] Array return
      return todos.value;
    });

    return {
      todos,
      todoStyle,
      addTodo,
      deleteTodo,
      toggleTodo,
      searchText,
      filteredTodos,
      error
    }
  }
}
</script>

<style scoped>

</style>
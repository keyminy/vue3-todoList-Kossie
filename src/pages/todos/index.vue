<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do List</h2>
      <button 
        class="btn btn-primary"
        @click="moveToCreatePage"
      >
        Create Todo
      </button>
    </div>
    <input 
        class="form-control"
        type="text" 
        v-model="searchText"
        placeholder="Search"
        @keyup.enter="searchTodo"
    >
    <hr/>
    <div v-if="!todos.length">
      추가된 Todo가 없습니다.
    </div>
    <TodoListVue 
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"  
    />
    <hr>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li
          v-if="currentPage !== 1" 
          class="page-item">
          <a style="cursor : pointer;"
            class="page-link" 
            @click="getTodos(currentPage - 1)">
            Previous
          </a>
        </li>
        <li 
          v-for="page in numberOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''"
        >
          <a style="cursor : pointer;" 
          class="page-link" @click="getTodos(page)">
            {{page}}
          </a>
        </li>
        <li
          v-if="numberOfPages !== currentPage" 
          class="page-item">
          <a style="cursor : pointer;" 
          class="page-link" @click="getTodos(currentPage + 1)">
            Next
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import {ref,computed,watch} from 'vue';
import TodoListVue from '@/components/TodoList.vue';
import axios from '@/axios';
import {useToast} from '@/composables/toast';
import { useRouter } from 'vue-router';

export default {
  components : {
    TodoListVue
  },
  setup () {
    const router = useRouter();
    const todos = ref([]);
    const error = ref('');
    /* 페이징 처리 변수들 */
    const numberOfTodos = ref(0);
    let limit = 5;
    const currentPage = ref(1);
    //총 Page의 수 = Todo갯수/limit
    const numberOfPages = computed(() => {
      //2.2 => 3으로 올림
      return Math.ceil(numberOfTodos.value/limit);
    });
    const searchText = ref('');
    
    const {
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();

    /* Toast관련 */
    // const toastMessage = ref('');
    // const toastAlertType = ref('');
    // const showToast = ref(false);
    // const toastTimeout = ref(null);

    // /* update완료 시, Toast보여주기 */
    // const triggerToast = (message,type = 'success') => {
    //   /* 매개변수로 오는 type의 값은 default로 'success'값 들어옴*/
    //   toastMessage.value = message;
    //   toastAlertType.value = type;
    //   showToast.value = true;
    //   /* Toast Message 5초 뒤 사라지게하기 */
    //   toastTimeout.value = setTimeout(()=> {
    //     console.log('test');
    //     toastMessage.value = '';
    //     toastAlertType.value = '';
    //     showToast.value = false; //v-if랑 연결됨
    //   },3000);
    // }
    /* End Toast관련 */

    const todoStyle = {
      textDecoration: 'line-through',
      color: 'gray'
    };

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(
          `todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        numberOfTodos.value = res.headers['x-total-count'];
        todos.value=(res.data);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong';
        triggerToast('Something went wrong','danger');
      }
    };

    //조회 시, TodoList목록 가져오는 함수 실행
    getTodos();

    /* 자식(TodoSimpleForm.vue)로 부터 추가된 TodoList {}값
    을 받아서 추가해준다. */
    const addTodo = async (todo) => {
      error.value = '';
      try {
        //DB에 todo를 저장
        //axios 2번째 인자 : 보낼 데이터(id는 AI값 자동)
        await axios.post('todos',{
          subject : todo.subject,
          completed : todo.completed,
        });
        getTodos(1);
        //todos.value.push(res.data);
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong';
        triggerToast('Something went wrong','danger');
      }
      // .then(res => {
      //   console.log(res);
      //   todos.value.push(res.data);
      // }).catch(err => {
      //   console.log(err);
      //   error.value = 'Something went wrong';
      // }); 
    }
    /* //emit을 안썼을때 방식
        todos.value.push({
          id: Date.now(),
          subject : todo.value,
          completed : false,
        });
    */
    
    const toggleTodo = async (idx, checked) => {
      //console.log(checked); //true또는 false
      error.value = '';
      const id = todos.value[idx].id;
      try {
        await axios.patch('todos/' + id, {
          completed : checked
        });
        todos.value[idx].completed = checked;
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong';
        triggerToast('Something went wrong','danger');
      }
    };

    const deleteTodo = async (id) => {
      error.value = '';
      //id찾는 과정 불필요해짐
      //const id = todos.value[idx].id;
      try {
        await axios.delete('todos/' + id);
        getTodos(1);
        //todos.value.splice(idx,1);
      } catch (error) {
        console.log(error);
        error.value = 'Something went wrong';
        triggerToast('Something went wrong','danger');
      }
    }

    let timeout = null;
    const searchTodo = () => {
      //enter 버튼 입력 시, 기존의 setTimeout취소 로직
      clearTimeout(timeout);
      getTodos(1);//검색하기
    };
    watch(searchText, () => {
      //새로운 text입력 시, 기존의 setTimeout취소 로직
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      },2000);
    });
    // const filteredTodos = computed(()=>{
    //   if(searchText.value){
    //     //검색결과가 있으면,filter된 [] Array리턴
    //     return todos.value.filter(todo => {
    //       return todo.subject.includes(searchText.value);
    //     });
    //   }
    //   //검색결과가 없다면 기존의 [] Array return
    //   return todos.value;
    // });

    const moveToCreatePage = () => {
      router.push({
        name : 'TodoCreate'
      })
    }

    return {
      todos,
      todoStyle,
      addTodo,
      deleteTodo,
      toggleTodo,
      searchText,
      //filteredTodos,
      error,
      getTodos,
      numberOfPages,
      currentPage,
      searchTodo,
      toastMessage,
      toastAlertType,
      showToast,
      moveToCreatePage
    }
  }
}
</script>

<style scoped>

</style>
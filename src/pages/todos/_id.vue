<template>
  <h1>To-Do Page</h1>
  <div v-if="loading">
    Loading...
  </div>
  <form 
    v-else
    @submit.prevent="onSave"
  >
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input 
            v-model="todo.subject" 
            type="text" 
            class="form-control"
          >
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button 
              class="btn"
              type="button"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click="toggleTodoStatus"
              >
            {{ todo.completed ? 'Completed' : 'Incompleted' }}
          </button>
          </div>
        </div>
      </div>
    </div>
    <button 
    type="submit" 
    class="btn btn-primary"
    :disabled="!todoUpdated"
    >
      Save
    </button>
    <button 
      class="btn btn-outline-dark ml-2"
      @click="moveToTodoListPage"
      >
      Cancle
    </button>
  </form>
  <ToastVue 
    v-if="showToast"
    :message="toastMessage"
    :type="toastAlertType"
  />
</template>

<script>
import { useRoute,useRouter } from 'vue-router';
import axios from 'axios';
import { ref,computed } from 'vue';
import _ from 'lodash';
import ToastVue from '@/components/Toast.vue';
import {useToast} from '@/composables/toast';

export default {
  components : {
    ToastVue
  },
  setup () {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);

    // const showToast = ref(false);
    // const toastMessage = ref('');
    // const toastAlertType = ref('');
    // const timeout = ref(null);
     /* update완료 시, Toast보여주기 */
    //  const triggerToast = (message,type = 'success') => {
    //   /* 매개변수로 오는 type의 값은 default로 'success'값 들어옴*/
    //   toastMessage.value = message;
    //   toastAlertType.value = type;
    //   showToast.value = true;
    //   /* Toast Message 5초 뒤 사라지게하기 */
    //   timeout.value = setTimeout(()=> {
    //     console.log('test');
    //     toastMessage.value = '';
    //     toastAlertType.value = '';
    //     showToast.value = false; //v-if랑 연결됨
    //   },3000);
    // }

    const {
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();



    /* axios를 이용해, 1개의 데이터 가져오자 */
    const getTodo = async () => {
      try {
        const res = 
          await axios.get('http://localhost:3000/todos/'+route.params.id);
        todo.value = {...res.data};
        originalTodo.value= {...res.data};
        //axios를 통해 값을 넣으면 loading을 false로
        loading.value = false;
      } catch (error) {
        console.log(error);
        //error가 있으면 에러가 있다는 Toast알림창 보내기
        triggerToast('Something went wrong!!','danger');
      }
    };

    const todoUpdated = computed(()=> {
      //isEqual이 true면 update가 안된 것
      //return값이 true일때, disabled="true"면, update안된건데
      return !(_.isEqual(todo.value,originalTodo.value));
    });

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    }

    const moveToTodoListPage = () => {
      router.push({
        name: 'Todos'
      })
    }

    getTodo();

   

    const onSave = async () => {
      try {
        const res = 
          await axios.put(`
          http://localhost:3000/todos/${route.params.id}
          `,{
          subject : todo.value.subject,
          completed : todo.value.completed
        });
        originalTodo.value = {...res.data};
        triggerToast('Successfully saved!!');
      } catch (error) {
        console.log(error);
        //error가 있으면 에러가 있다는 Toast알림창 보내기
        triggerToast('Something went wrong!!','danger');
      }
    };

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      showToast,
      todoUpdated,
      toastMessage,
      toastAlertType
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
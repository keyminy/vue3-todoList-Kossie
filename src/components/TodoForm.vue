<template>
  <div v-if="loading">
    Loading...
  </div>
  <form 
    v-else
    @submit.prevent="onSave"
  >
    <div class="row">
      <div class="col-6">
        <InputVue 
          label="Subject"
          v-model:subject="todo.subject"
          :error="subjectError"
        />
      </div>
      <div class="col-6" v-if="editing">
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
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea v-model="todo.body" 
          cols="30" rows="10" class="form-control">
          </textarea>
        </div>
      </div>
    </div>
    <button 
    type="submit" 
    class="btn btn-primary"
    :disabled="!todoUpdated"
    >
      {{editing? 'Update' : 'Create'}}
    </button>
    <button 
      class="btn btn-outline-dark ml-2"
      @click="moveToTodoListPage"
      >
      Cancle
    </button>
  </form>
  <transition name="fade">
    <ToastVue 
      v-if="showToast"
      :message="toastMessage"
      :type="toastAlertType"
    />
  </transition>
</template>

<script>
import { useRoute,useRouter } from 'vue-router';
import axios from '@/axios';
import { ref,computed,onUpdated } from 'vue';
import _ from 'lodash';
import ToastVue from '@/components/Toast.vue';
import {useToast} from '@/composables/toast';
import InputVue from './Input.vue';

export default {
  components : {
    ToastVue,
    InputVue
  },
  props : {
    editing: {
      type: Boolean,
      default: false
    }
  },
  setup (props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject:'',
      completed:false,
      body: ''
    });

    onUpdated(() => {
          console.log(todo.value.subject)
        })

    const originalTodo = ref(null);
    const loading = ref(false);
    const subjectError = ref('');

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
      //getTodo실행 시 , loading값 true
      loading.value = true;
      try {
        const res = 
          await axios.get('todos/'+route.params.id);
        todo.value = {...res.data};
        originalTodo.value= {...res.data};
        //axios를 통해 값을 넣으면 loading을 false로
        loading.value = false;
      } catch (error) {
        loading.value = false;
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

    if(props.editing){
      getTodo();
    }
   

    const onSave = async () => {
      subjectError.value='';//초기화
      if(!todo.value.subject){
        //subject가 비어있으면 return으로 onSave()함수 멈춤
        subjectError.value = 'Subject is required';
        return;
      }
      try {
        let res;
        const data = {
          subject : todo.value.subject,
          completed : todo.value.completed,
          body : todo.value.body
        }
        if(props.editing){
          //editing이면 put요청
          res = 
            await axios.put(`todos/${route.params.id}`,data);
            originalTodo.value = {...res.data};
        }else{
          //create일 경우 post요청
          res = 
            await axios.post(`todos`,data);
            //Create후 Form들 빈값으로 초기화
            todo.value.subject = '';
            todo.value.body = '';
        }
        const msg = 'Successfully ' +  (props.editing?'Updated':'Created');
        triggerToast(msg);
        //Create 생성 후,TodoList페이지로 이동하게 하기
        if(!props.editing){
          router.push({
            name:'Todos'
          })
        }
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
      toastAlertType,
      subjectError
    }
  }
}
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition : all 0.5s ease;
  }
  /*시작할때와 끝날때의 상태 */
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    /* 위에서 아래로 내려오는 애니메이션 */
    transform : translateY(-30px); /* 30px위에서 시작함 */
  }
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
    transform : translateY(0px);
  }
</style>
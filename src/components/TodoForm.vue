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
</template>

<script>
import { useRoute,useRouter } from 'vue-router';
import axios from '@/axios';
import { ref,computed,onUpdated } from 'vue';
import _ from 'lodash';
import {useToast} from '@/composables/toast';
import InputVue from './Input.vue';


export default {
  components : {
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
     /* update?????? ???, Toast???????????? */
    //  const triggerToast = (message,type = 'success') => {
    //   /* ??????????????? ?????? type??? ?????? default??? 'success'??? ?????????*/
    //   toastMessage.value = message;
    //   toastAlertType.value = type;
    //   showToast.value = true;
    //   /* Toast Message 5??? ??? ?????????????????? */
    //   timeout.value = setTimeout(()=> {
    //     console.log('test');
    //     toastMessage.value = '';
    //     toastAlertType.value = '';
    //     showToast.value = false; //v-if??? ?????????
    //   },3000);
    // }

    const {
      toastMessage,
      toastAlertType,
      showToast,
      triggerToast
    } = useToast();



    /* axios??? ?????????, 1?????? ????????? ???????????? */
    const getTodo = async () => {
      //getTodo?????? ??? , loading??? true
      loading.value = true;
      try {
        const res = 
          await axios.get('todos/'+route.params.id);
        todo.value = {...res.data};
        originalTodo.value= {...res.data};
        //axios??? ?????? ?????? ????????? loading??? false???
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.log(error);
        //error??? ????????? ????????? ????????? Toast????????? ?????????
        triggerToast('Something went wrong!!','danger');
      }
    };

    const todoUpdated = computed(()=> {
      //isEqual??? true??? update??? ?????? ???
      //return?????? true??????, disabled="true"???, update????????????
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
      subjectError.value='';//?????????
      if(!todo.value.subject){
        //subject??? ??????????????? return?????? onSave()?????? ??????
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
          //editing?????? put??????
          res = 
            await axios.put(`todos/${route.params.id}`,data);
            originalTodo.value = {...res.data};
        }else{
          //create??? ?????? post??????
          res = 
            await axios.post(`todos`,data);
            //Create??? Form??? ???????????? ?????????
            todo.value.subject = '';
            todo.value.body = '';
        }
        const msg = 'Successfully ' +  (props.editing?'Updated':'Created');
        triggerToast(msg);
        //Create ?????? ???,TodoList???????????? ???????????? ??????
        if(!props.editing){
          router.push({
            name:'Todos'
          })
        }
      } catch (error) {
        console.log(error);
        //error??? ????????? ????????? ????????? Toast????????? ?????????
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

</style>
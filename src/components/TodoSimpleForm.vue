<template>
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
</template>

<script>
import {ref} from 'vue';

export default {
  emits:['add-todo'],
  setup (props,context) {
    
    const todo = ref('');
    const hasError = ref(false);

    const onSubmit = () => {
      if(todo.value === ''){
        hasError.value = true;
      }else{
        //input창에 값을 입력한 경우니까 push
        /* App.vue로 이벤트 보내기(18) */
        context.emit('add-todo',{
          //부모 컴포넌트로 올려줄 데이터
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
    return {
      todo,
      hasError,
      onSubmit
    }
  }
}
</script>

<style scoped>

</style>
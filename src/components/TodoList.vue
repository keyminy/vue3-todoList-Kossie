<template>
  <!-- <div
    v-for="(todo,idx) in todos" 
    :key="todo.id"
    class="card mt-2"
  > -->
  <ListVue
    :items="todos"
  >
    <template v-slot:default="{item,idx}">
      <div
        class="card-body p-2 d-flex align-items-center"
        style="cursor : pointer"
        @click="moveToPage(item.id)"
      >
        <!--여기서 flex-grow-1하면 Delete버튼이 맨 오른쪽으로 가게-->
        <div class="flex-grow-1">
          <input 
            class="ml-2 mr-2"
            type="checkbox"
            :checked="item.completed"
            @change="toggleTodo(idx, $event)"
            @click.stop
          >
          <span 
            :class="{todo : item.completed}">
            {{item.subject}}
          </span>
        </div>
        <div>
          <button 
            class="btn btn-danger btn-sm"
            @click.stop="openModal(item.id)">
            Delete
          </button>
        </div>
      </div>
    </template>
  </ListVue>
  <!-- </div> -->
  <teleport to="#modal">
    <ModalVue
      v-if="showModal"
      @close="closeModal"
      @delete="deleteTodo"
    />
  </teleport>
</template>

<script>
import { useRouter } from 'vue-router';
import ModalVue from './DeleteModal.vue';
import {ref} from 'vue';
import ListVue from './List.vue';
import {getCurrentInstance} from 'vue';

export default {
  components:{
    ModalVue,
    ListVue
  },
  props: {
    todos : {
      tpye: Array,
      required: true
    }
  },
  emits:['toggle-todo','delete-todo'],
  setup () {
    const {emit} = getCurrentInstance();
    const router = useRouter();
    /* Modal관련 */
    const showModal = ref(false);
    const todoDeleteId = ref(null);//삭제할 todoId
    const openModal = (id) => {
      //매개변수로 오는 id는 삭제할 todo.id
      todoDeleteId.value = id; 
      showModal.value = true;
    }
    const closeModal = () => {
      todoDeleteId.value = null;
      showModal.value = false;
    }

    const toggleTodo = (idx,event) => {
      //idx를 부모컴포넌트로 보내준다.
      emit('toggle-todo',idx,event.target.checked);
    }
    //App.vue부모컴포넌트에 todoDeleteId전달
    const deleteTodo = () => {
      emit('delete-todo',todoDeleteId.value);
      showModal.value = false;
      todoDeleteId.value = null;
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
      moveToPage,
      showModal,
      openModal,
      closeModal
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
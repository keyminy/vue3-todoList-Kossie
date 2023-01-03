<template>
  <ModalVue>
    <template v-slot:title>
      Delete Todo~!
    </template>
    <template v-slot:body>
      정말 지울껀가?
    </template>
    <template v-slot:footer>
      <button 
        type="button"
        class="btn btn-secondary"
        @click="onClose"
      >
        Close
      </button>
      <button 
        type="button" 
        class="btn btn-danger"
        @click="onDelete"
      >
        Delete
      </button>
    </template>
  </ModalVue>
</template>

<script>
import ModalVue from './Modal.vue';
import {getCurrentInstance} from 'vue';

export default {
  components : {
    ModalVue
  },
  setup () {
    const {emit} = getCurrentInstance();
    const onClose = () => {
      emit('close');
    }
    const onDelete = () => {
      emit('delete');
    }

    return {
      onClose,
      onDelete
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
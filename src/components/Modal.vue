<template>
  <!-- Modal -->
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            <slot name="title"></slot>
          </h1>
          <button 
            type="button" class="btn-close"
            @click="onClose">
          </button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getCurrentInstance} from 'vue';

export default {
  setup () {
    const {emit} = getCurrentInstance();
    const onClose = () => {
      emit('close');
    }


    return {
      onClose
    }
  }
}
</script>

<style scoped>
  .modal-wrapper{
    position: fixed;
    z-index: 100; /* modal창이 pagination버튼보다 위에가게 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    /*주위 배경 검게 만드는 군,하긴 width,height 100%다 차지하게 하니까*/
  }
</style>
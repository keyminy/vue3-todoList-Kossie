<template>
  <div class="toast-box">
    <transition-group name="slide">
      <div
        v-for="toast in toasts"
        :key ="toast.id" 
        class="alert"
        :class="`alert-${toast.type}`"
        role="alert">
          {{toast.message}}
      </div>
    </transition-group>
  </div>
</template>

<script>
import {useToast} from '@/composables/toast';

export default {
  setup () {
    const {
      toasts
    } = useToast();

    return {
      toasts
    }
  }
}
</script>

<style scoped>
  .toast-box {
    position: fixed;
    top: 10px;
    right: 10px;
  }
  .slide-enter-active,
  .slide-leave-active {
    transition : all 0.5s ease;
  }
  /*시작할때와 끝날때의 상태 */
  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    /* 위에서 아래로 내려오는 애니메이션 */
    transform : translateY(-30px); /* 30px위에서 시작함 */
  }
  .slide-enter-to,
  .slide-leave-from {
    opacity: 1;
    transform : translateY(0px);
  }
</style>
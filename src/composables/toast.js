import { ref,onUnmounted } from "vue";

export const useToast = () => {
  /* Toast관련 */
  const toastMessage = ref('');
  const toastAlertType = ref('');
  const showToast = ref(false);
  const timeout = ref(null);

  /* update완료 시, Toast보여주기 */
  const triggerToast = (message,type = 'success') => {
    /* 매개변수로 오는 type의 값은 default로 'success'값 들어옴*/
    toastMessage.value = message;
    toastAlertType.value = type;
    showToast.value = true;
    /* Toast Message 5초 뒤 사라지게하기 */
    timeout.value = setTimeout(()=> {
      console.log('test');
      toastMessage.value = '';
      toastAlertType.value = '';
      showToast.value = false; //v-if랑 연결됨
    },3000);
  }
  
  onUnmounted(()=>{
    console.log('unmounted!');
    clearTimeout(timeout.value); //setTimeout 멈춤
  });
  /* End Toast관련 */
  return {
    toastMessage,
    toastAlertType,
    showToast,
    triggerToast
  }
}
import { computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  /* Vuex변수 */
  const store = useStore();
  /* Toast관련 */
  const toasts = computed(()=>store.state.toast.toasts);//toasts = []가져오기
  // const toastMessage = computed(()=>store.getters['toast/toastMessageWithSmile']);
  // const toastAlertType = computed(()=>store.state.toast.toastAlertType);
  // const showToast = computed(()=>store.state.toast.showToast);

  /* update완료 시, Toast보여주기 */
  const triggerToast = (message,type = 'success') => {
    /* 매개변수로 오는 type의 값은 default로 'success'값 들어옴*/
    // toastMessage.value = message;
    // toastAlertType.value = type;
    // showToast.value = true;
    // /* Toast Message 5초 뒤 사라지게하기 */
    // timeout.value = setTimeout(()=> {
    //   console.log('test');
    //   toastMessage.value = '';
    //   toastAlertType.value = '';
    //   showToast.value = false; //v-if랑 연결됨
    // },3000);
    store.dispatch('toast/triggerToast',{message:message,type:type});
  }
  
  /* End Toast관련 */
  return {
    toasts,
    triggerToast
  }
}
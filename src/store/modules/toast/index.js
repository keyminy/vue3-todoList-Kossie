export default {
  namespaced : true,
  state : {
    /* Toast관련 */
    toasts: [],
    /*//Toast하나일때
    toastMessage: '',
    toastAlertType: '',
    showToast : false
    */
  },
  mutations:{
    /* //Toast하나일때 
    UPDATE_TOAST_MESSAGE(state,payload){
      state.toastMessage = payload;
    },
    UPDATE_TOAST_ALERT_TYPE(state,payload){
      state.toastAlertType = payload;
    },
    UPDATE_TOAST_STATUS(state,payload){
      state.showToast = payload;
    },
    */
    ADD_TOAST(state,payload){
      state.toasts.push(payload);
    },
    REMOVE_TOAST(state) {
      //첫번째 {}를 [{},{},...,{}]에서 삭제
      state.toasts.shift();
    }

  },
  actions:{
    triggerToast({commit},message,type = 'success') {
      /* 매개변수로 오는 type의 값은 default로 'success'값 들어옴*/
      /*//하나의 Toast만 이용햇던 방식
      commit('UPDATE_TOAST_MESSAGE',message);
      commit('UPDATE_TOAST_ALERT_TYPE',type);
      commit('UPDATE_TOAST_STATUS',true);
      */
     commit('ADD_TOAST',{
      id : Date.now(),
      message : message,
      type : type
     });


      /* Toast Message 5초 뒤 사라지게하기 */
      //timeout.value = setTimeout(()=> {
      setTimeout(()=> {
        /* //Toast메시지 1개일때만 
        //toastMessage.value = '';
        commit('UPDATE_TOAST_MESSAGE','');
        //toastAlertType.value = '';
        commit('UPDATE_TOAST_ALERT_TYPE','');
        //showToast.value = false; //v-if랑 연결됨
        commit('UPDATE_TOAST_STATUS',false);
        */
        commit('REMOVE_TOAST')
      },7000);
    }
  },
  getters : {
    toastMessageWithSmile (state){
      return state.toastMessage + ' ^-^';
    }
  }
}

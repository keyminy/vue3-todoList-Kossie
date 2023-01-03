import { reactive,toRefs } from "vue"

export const useCount = () => {
  const state = reactive({
    count : 0
  });
  /*toRefs로, reactive 객체({})변수를 감싸주면
   그 value도 ref속성이됨  */
  return toRefs(state);
}
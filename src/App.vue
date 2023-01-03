<template>
  <NavbarVue/>
  <div class="container">
    <router-view/>
  </div>
  <ToastVue/>
</template>

<script>
import ToastVue from './components/Toast.vue';
import NavbarVue from './components/Navbar.vue';

export default {
  components : {
    ToastVue,
    NavbarVue
  },
  setup() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
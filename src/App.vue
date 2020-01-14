<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
import router from './router'

export default {
  name: 'app',
  router
}
</script>

<style>
  body{
    font-family: "微软雅黑";
    margin: 0;
  }
</style>

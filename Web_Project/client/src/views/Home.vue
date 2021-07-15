<template>
  <div class="home mt-5" >
    <img  alt="Vue logo" src="../assets/home.jpg">
    <HelloWorld msg="Welcome to Your Soldout store"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
